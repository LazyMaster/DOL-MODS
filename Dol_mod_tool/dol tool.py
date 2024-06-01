#DOL_多合一

import os
import zipfile
from opencc import OpenCC
import json
from zipfile import ZipFile
import PySimpleGUI as sg
from PIL import Image


def transform(content , inverse = False):
    if inverse:
        cc = OpenCC('t2s')
        return cc.convert(content)
    cc = OpenCC('s2twp')
    return cc.convert(content)

def process_zip_file(zip_path, output_path=None , inverse = False):
    name_addon = '_CHS.zip' if inverse else '_CHT.zip'
    if not output_path:
        output_path = os.path.splitext(zip_path)[0] + name_addon

    # 創建一個新的 zip 文件用於存儲轉換後的內容
    with zipfile.ZipFile(zip_path, 'r') as zip_ref, zipfile.ZipFile(output_path, 'w') as new_zip:
        for file_info in zip_ref.infolist():
            with zip_ref.open(file_info) as file:
                if file_info.filename.endswith((".json",".twee",".js")):
                    _file = file.read().decode('utf-8')
                    converted_content = transform(_file,inverse=inverse)
                    new_zip.writestr(file_info.filename, converted_content.encode('utf-8'))
                else:
                    new_zip.writestr(file_info.filename, file.read())
                    
#DOL用模組更新
def filepath_reader(directory, output_dict):
    output_dict["additionFile"] = []
    output_dict["imgFileList"] = []
    output_dict["tweeFileList"] = []
    output_dict["scriptFileList"] = []
    for root, _, files in os.walk(os.path.join(directory)):
        for file in files:
            file_path = os.path.relpath(os.path.join(root, file), directory)
            if root == directory:
                pass
            elif file_path.endswith('.png') or file_path.endswith('gif'):
                output_dict["imgFileList"].append(file_path.replace("\\", "/"))
            elif file_path.endswith('.twee'):
                output_dict["tweeFileList"].append(file_path.replace("\\", "/"))
            elif file_path.endswith('.js'):
                output_dict["scriptFileList"].append(file_path.replace("\\", "/"))
            else:
                output_dict["additionFile"].append(file_path.replace("\\", "/"))

def make_mod(folder_path):
    os.makedirs(os.path.join(folder_path,'img'), exist_ok=True)
    output_dict = {}
    if os.path.exists(os.path.join(folder_path,'boot.json')):
        with open(os.path.join(folder_path,'boot.json'), 'r', encoding='utf-8') as boot_json:
            output_dict = json.load(boot_json)
            
        output_dict['version'] = '.'.join(output_dict['version'].split('.')[:-1] + [str(int(output_dict['version'].split('.')[-1]) + 1)])

        if "ModLoader DoL ImageLoaderHook" not in [dic["modName"] for dic in output_dict['addonPlugin']]:
            output_dict['addonPlugin'].append(
                {
                "modName": "ModLoader DoL ImageLoaderHook",
                "addonName": "ImageLoaderAddon",
                "modVersion": "^2.3.0",
                "params": []
                }
            )
        if "ModLoader DoL ImageLoaderHook" not in [dic["modName"] for dic in output_dict['dependenceInfo']]:
            output_dict['dependenceInfo'].append(
                {
                "modName": "ModLoader DoL ImageLoaderHook",
                "version": "^2.3.0"
                }
            )
    else:   
        output_dict['name'] = os.path.basename(folder_path)
        output_dict['version'] = '1.0.0'
        output_dict['styleFileList'] = []
        output_dict['scriptFileList'] = []
        output_dict['tweeFileList'] = []
        output_dict['addonPlugin'] = [
            {
            "modName": "ModLoader DoL ImageLoaderHook",
            "addonName": "ImageLoaderAddon",
            "modVersion": "^2.3.0",
            "params": [
            ]
            }
            ]
        output_dict['dependenceInfo'] = [
            {
            "modName": "ModLoader DoL ImageLoaderHook",
            "version": "^2.3.0"
            }
            ]
    filepath_reader(folder_path, output_dict)
    # 将内容输出到文本文件
    
    with open(os.path.join(folder_path,'boot.json'), 'w', encoding='utf-8') as file:
        json.dump(output_dict, file, indent=2, ensure_ascii=False)

    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        print(f"錯誤：'{folder_path}' 不是有效的資料夾路徑。")
        return
    # 建立 ZipFile 物件
    with ZipFile(folder_path + "_" + output_dict["version"].replace(".","_") +'.zip', 'w') as zip_file:
        # 將資料夾中的所有文件添加到 zip 檔案
        for foldername, subfolders, filenames in os.walk(folder_path):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                arcname = os.path.relpath(file_path, folder_path)
                zip_file.write(file_path, arcname)



sg.theme('DarkAmber')   # Add a touch of color
# All the stuff inside your window.
filename   = sg.Text('')
foldername = sg.Text('')
displaytext = sg.Multiline(size=(1000, 10))

layout = [  [sg.Text('DOL MOD TOOL')],     
            [sg.Text('')],                  #1
            [sg.FileBrowse('File :',enable_events=True,key='File'),filename],
            [sg.FolderBrowse('Folder :',enable_events=True,key='Folder'),foldername],
            [sg.Button('Folder to Mod')],
            [sg.Button('File 簡轉繁')],
            [sg.Button('File 繁轉簡')]]
print(layout)
layout_addon = []
# Create the Window
window = sg.Window('DOL雜用工具', layout ,resizable=True )
# Event Loop to process "events" and get the "values" of the inputs
def Dol_tool():
    while True:
        event, values = window.read()
        if event == 'File':
            filename.update( values['File'])
        if event == 'Folder':
            foldername.update( values['Folder'])

        if event == 'Folder to Mod':
            if values['Folder'] != "":
                layout[1][0].update('Running')
                make_mod(values['Folder'])
                layout[1][0].update('Finished')
            else:
                sg.popup('No folder selected')
        if event == 'File 簡轉繁':
            if values['File'] != "":
                layout[1][0].update('Running')
                process_zip_file(values['File'])
                layout[1][0].update('Finished')
            else:
                sg.popup('No File selected')
        if event == 'File 繁轉簡':
            if values['File'] != "":
                layout[1][0].update('Running')
                process_zip_file(values['File'],inverse=True)
                layout[1][0].update('Finished')
            else:
                sg.popup('No File selected')
        if event == sg.WIN_CLOSED or event == 'Cancel': # if user closes window or clicks cancel
            break
    window.close()
if __name__ == '__main__':
    Dol_tool()