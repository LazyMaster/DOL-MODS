import os
import zipfile
from opencc import OpenCC
import json
from zipfile import ZipFile
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import font

def transform(content, inverse=False):
    if inverse:
        cc = OpenCC('t2s')
        return cc.convert(content)
    cc = OpenCC('s2twp')
    return cc.convert(content)

def process_zip_file(zip_path, output_path=None, inverse=False):
    name_addon = '_CHS.zip' if inverse else '_CHT.zip'
    if not output_path:
        output_path = os.path.splitext(zip_path)[0] + name_addon
    with zipfile.ZipFile(zip_path, 'r') as zip_ref, zipfile.ZipFile(output_path, 'w') as new_zip:
        for file_info in zip_ref.infolist():
            with zip_ref.open(file_info) as file:
                if file_info.filename.endswith((".json", ".twee", ".js")):
                    try:
                        _file = file.read().decode('utf-8')
                        converted_content = transform(_file, inverse=inverse)
                        new_zip.writestr(file_info.filename, converted_content.encode('utf-8'))
                    except UnicodeDecodeError:
                        print(f"警告：無法以 UTF-8 解碼 {file_info.filename}，直接複製。")
                        new_zip.writestr(file_info.filename, file.read())
                else:
                    new_zip.writestr(file_info.filename, file.read())

def filepath_reader(directory, output_dict):
    output_dict["additionFile"] = []
    output_dict["imgFileList"] = []
    output_dict["tweeFileList"] = []
    output_dict["scriptFileList"] = []
    output_dict["additionBinaryFile"] = []
    for root, _, files in os.walk(os.path.join(directory)):
        for file in files:
            file_path = os.path.relpath(os.path.join(root, file), directory)
            if root == directory:
                pass
            elif file_path.endswith(('.png', '.gif')):
                output_dict["additionBinaryFile"].append(file_path.replace("\\", "/"))
            elif file_path.endswith('.twee'):
                output_dict["tweeFileList"].append(file_path.replace("\\", "/"))
            elif file_path.endswith('.js'):
                output_dict["scriptFileList"].append(file_path.replace("\\", "/"))
            else:
                output_dict["additionFile"].append(file_path.replace("\\", "/"))
    if output_dict["additionBinaryFile"]:
        output_dict['addonPlugin'].append(
            {
                "modName": "BeautySelectorAddon",
                "addonName": "BeautySelectorAddon",
                "modVersion": "^2.0.0",
                "params": {
                    "type": output_dict['name'],
                    "imgFileList": output_dict["additionBinaryFile"],
                }
            }
        )
        if "BeautySelectorAddon" not in [dic["modName"] for dic in output_dict['dependenceInfo']]:
            output_dict['dependenceInfo'].append(
                {
                    "modName": "BeautySelectorAddon",
                    "version": "^2.0.0"
                }
            )

def make_mod(folder_path):
    os.makedirs(os.path.join(folder_path, 'img'), exist_ok=True)
    output_dict = {}
    if os.path.exists(os.path.join(folder_path, 'boot.json')):
        with open(os.path.join(folder_path, 'boot.json'), 'r', encoding='utf-8') as boot_json:
            output_dict = json.load(boot_json)
        output_dict['version'] = '.'.join(output_dict['version'].split('.')[:-1] + [str(int(output_dict['version'].split('.')[-1]) + 1)])
        output_dict['addonPlugin'] = [d for d in output_dict['addonPlugin'] if d["modName"] != "BeautySelectorAddon"]
    else:
        output_dict['name'] = os.path.basename(folder_path)
        output_dict['version'] = '1.0.0'
        output_dict['styleFileList'] = []
        output_dict['scriptFileList'] = []
        output_dict['tweeFileList'] = []
        output_dict['addonPlugin'] = []
        output_dict['dependenceInfo'] = []
    filepath_reader(folder_path, output_dict)
    with open(os.path.join(folder_path, 'boot.json'), 'w', encoding='utf-8') as file:
        json.dump(output_dict, file, indent=2, ensure_ascii=False)
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        print(f"錯誤：'{folder_path}' 不是有效的資料夾路徑。")
        return
    with ZipFile(folder_path + "_" + output_dict["version"].replace(".", "_") + '.zip', 'w') as zip_file:
        for _foldername, _, filenames in os.walk(folder_path):
            for _filename in filenames:
                file_path = os.path.join(_foldername, _filename)
                arcname = os.path.relpath(file_path, folder_path)
                zip_file.write(file_path, arcname)

def create_gui():
    root = tk.Tk()
    root.title("DOL 雜用工具")
    root.geometry("600x400")
    root.configure(bg="#2C2C2C")  # 深灰色背景

    # 定義字型
    title_font = font.Font(family="Arial", size=14, weight="bold")
    label_font = font.Font(family="Arial", size=10)
    button_font = font.Font(family="Arial", size=10)

    # 標題
    title_label = tk.Label(
        root,
        text="DOL 雜用工具",
        font=title_font,
        bg="#2C2C2C",
        fg="#FFD700"  # 淺琥珀色文字
    )
    title_label.pack(anchor="w", padx=10, pady=10)

    # 狀態標籤
    status_label = tk.Label(
        root,
        text="狀態：待機",
        font=label_font,
        bg="#2C2C2C",
        fg="#FFFFFF"
    )
    status_label.pack(anchor="w", padx=10, pady=5)

    # 檔案選擇
    file_label = tk.Label(
        root,
        text="未選擇檔案",
        font=label_font,
        bg="#2C2C2C",
        fg="#D3D3D3"
    )
    file_label.pack(anchor="w", padx=10, pady=5)
    file_path_var = tk.StringVar()
    def select_file():
        file_path = filedialog.askopenfilename(filetypes=[("ZIP files", "*.zip")])
        if file_path:
            file_path_var.set(file_path)
            file_label.config(text=f"檔案：{os.path.basename(file_path)}")
    tk.Button(
        root,
        text="選擇檔案",
        font=button_font,
        bg="#4682B4",  # 黯淡灰藍色
        fg="#FFFFFF",
        activebackground="#3A6B8C",  # 點擊時較深的灰藍色
        command=select_file
    ).pack(anchor="w", padx=10, pady=5)

    # 資料夾選擇
    folder_label = tk.Label(
        root,
        text="未選擇資料夾",
        font=label_font,
        bg="#2C2C2C",
        fg="#D3D3D3"
    )
    folder_label.pack(anchor="w", padx=10, pady=5)
    folder_path_var = tk.StringVar()
    def select_folder():
        folder_path = filedialog.askdirectory()
        if folder_path:
            folder_path_var.set(folder_path)
            folder_label.config(text=f"資料夾：{os.path.basename(folder_path)}")
    tk.Button(
        root,
        text="選擇資料夾",
        font=button_font,
        bg="#4682B4",  # 黯淡灰藍色
        fg="#FFFFFF",
        activebackground="#3A6B8C",  # 點擊時較深的灰藍色
        command=select_folder
    ).pack(anchor="w", padx=10, pady=5)

    # 按鈕功能
    def folder_to_mod():
        if not folder_path_var.get():
            messagebox.showerror("錯誤", "請選擇一個資料夾")
            return
        status_label.config(text="狀態：運行中")
        root.update()
        make_mod(folder_path_var.get())
        status_label.config(text="狀態：完成")

    def file_s2t():
        if not file_path_var.get():
            messagebox.showerror("錯誤", "請選擇一個檔案")
            return
        status_label.config(text="狀態：運行中")
        root.update()
        process_zip_file(file_path_var.get())
        status_label.config(text="狀態：完成")

    def file_t2s():
        if not file_path_var.get():
            messagebox.showerror("錯誤", "請選擇一個檔案")
            return
        status_label.config(text="狀態：運行中")
        root.update()
        process_zip_file(file_path_var.get(), inverse=True)
        status_label.config(text="狀態：完成")

    tk.Button(
        root,
        text="資料夾轉 Mod",
        font=button_font,
        bg="#4682B4",  # 黯淡灰藍色
        fg="#FFFFFF",
        activebackground="#3A6B8C",  # 點擊時較深的灰藍色
        command=folder_to_mod
    ).pack(anchor="w", padx=10, pady=5)
    tk.Button(
        root,
        text="檔案 簡轉繁",
        font=button_font,
        bg="#4682B4",  # 黯淡灰藍色
        fg="#FFFFFF",
        activebackground="#3A6B8C",  # 點擊時較深的灰藍色
        command=file_s2t
    ).pack(anchor="w", padx=10, pady=5)
    tk.Button(
        root,
        text="檔案 繁轉簡",
        font=button_font,
        bg="#4682B4",  # 黯淡灰藍色
        fg="#FFFFFF",
        activebackground="#3A6B8C",  # 點擊時較深的灰藍色
        command=file_t2s
    ).pack(anchor="w", padx=10, pady=5)

    root.mainloop()

if __name__ == '__main__':
    create_gui()