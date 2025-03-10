import unicodedata
import tabulate

fileName = "Unicode_Zeichen.txt"

with open (fileName, "r", encoding="utf-8") as file:
    glyphs = file.read()

header = ["Codepoint", "utf-8 encoding", "utf-16be encoding", "utf-32 encoding", "Name of Character", "Glyph"]
data = []

for char in glyphs:
    codepoint = ord(char)
    codepointOutput = f"U+{codepoint:04X}"
    utf_8 = char.encode("utf-8").hex()
    utf_16be = char.encode("utf-16be").hex()
    utf_32be = char.encode("utf-32be").hex()
    charName = unicodedata.name(char)
    glyphdata = [codepointOutput, utf_8, utf_16be, utf_32be, charName, char]
    data.append(glyphdata)

print(tabulate.tabulate(data, headers=header, tablefmt="grid"))