import re
from os import walk

outputFile = open("script.user.js", "w")
requireList = []

def copyJs(jsFile):
    with open(jsFile, "r") as js:
        outputFile.write("//start file: " + jsFile + "\n")
        for line in js:
            print(line, end="")
            if (re.match("import", line)):
                print("//skip import")
            elif (re.search("require", line)):
                if (requireList.count(line) < 1):
                    print("//new require")
                    requireList.append(line)
                    outputFile.write(line)
                else:
                    print("//require already exists")
            else:
                outputFile.write(line)
    outputFile.write("//end file: " + jsFile + "\n")
    outputFile.write("\n")
    outputFile.write("\n")


  
for root, dirs, files in walk("./src"):
    # print("路徑：", root)
    # print("  目錄：", dirs)
    # print("  檔案：", files)
    for f in files:
        fileRoot = root + "/" + f
        print(fileRoot)
        copyJs(fileRoot)

outputFile.write("\n")
outputFile.close()
