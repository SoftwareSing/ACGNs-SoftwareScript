def getVersion():
    return "{majorVer}.{minorVer}.{bugFixVer}".format(
        majorVer = str(majorVersion),
        minorVer = str(minorVersion).zfill(2),
        bugFixVer = str(bugFixVersion).zfill(2)
    )

# 從版本 5.14.00 以後開始使用本檔案紀錄version
majorVersion = 5
minorVersion = 14
bugFixVersion = 0

#------ 由此開始寫 version 變化 ------
bugFixVersion += 1 # 簡化 關於 頁面的內容
minorVersion += 1 # 針對登入中的使用者增加 預估產品消費回饋金
