import re
from os import walk

outputFile = open("ACGNs-SoftwareScript.user.js", "w", encoding = 'utf8')
outputFile.write("/* 本檔由 MergeFile.py 自動產生, 欲修改code請至src資料夾 */" + "\n")

def findFileName(line):
    a = re.search("[A-Za-z0-9_]*[\"\'];$", line).group()
    fileName = re.search("[A-Za-z0-9_]*", a).group()
    return fileName


fileNameList = []
fileRootList = []
importList = []
writeCount = -1

def writeIntoFile(line):
    if (re.match("export ", line)):
        line = line.lstrip("export ")
    outputFile.write(line)

requireList = []
def copyJs(jsFile):
    global writeCount
    writeCount += 1
    dash = ""
    for i in range(writeCount):
        dash += "-"
    outputFile.write("//" + dash + "start file: " + jsFile + "\n")

    readJsFile(jsFile)

    outputFile.write("//" + dash + "end file: " + jsFile + "\n")
    space = ""
    for i in range(writeCount):
        space += " "
    outputFile.write("//" + space + "===========================\n")
    writeCount -= 1


def readJsFile(jsFile):
    with open(jsFile, "r", encoding = 'utf8') as js:
        for line in js:
            print(line, end="")
            if (re.match("import", line)):
                importFile(line)
            elif (re.search("require", line)):
                requireFile(line)
            elif (re.search("eslint-enable", line)):
                print("//skip eslint-enable")
            else:
                writeIntoFile(line)


def importFile(line):
    fileName = findFileName(line)
    if (importList.count(fileName) < 1):
        print("//new import")
        importList.append(fileName)
        importRoot = fileRootList[fileNameList.index(fileName + ".js")]
        copyJs(importRoot)
    else:
        print("//import already exists")


def requireFile(line):
    if (requireList.count(line) < 1):
        print("//new require")
        requireList.append(line)
        writeIntoFile(line)
    else:
        print("//require already exists")


  
for root, dirs, files in walk("./src"):
    # print("路徑：", root)
    # print("  目錄：", dirs)
    # print("  檔案：", files)
    for f in files:
        fileRoot = root + "/" + f
        print(fileRoot)
        fileNameList.append(f)
        fileRootList.append(fileRoot)
mainRoot = fileRootList[fileNameList.index("main.js")]
copyJs(mainRoot)

outputFile.close()
