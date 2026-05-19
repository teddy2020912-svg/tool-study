# 🔑 Password Variant Tool PRO

**Multi-Stage Password Mutation Engine v2.0**

Generate unlimited password variants from username:password pairs using advanced mutation rules.

## ✨ Features

### 12 Rule Categories (65+ Transformations)
- 📝 **Capitalization**: lowercase, UPPERCASE, Capitalize
- 🔢 **Numbers**: Add 123-123456789
- 📅 **Years**: Add 1990, 2000, 2010, 2020, 2024, 90, 95
- 🔣 **Special Chars**: @, @@, !, !!, #, $
- 🎯 **Vietnamese Suffixes**: vip, pro, cute, love, baby, hihi, kaka
- 💠 **LEET Speak**: a→@, o→0, i→1, e→3, s→$, t→7
- ➖ **Separators**: Insert _, -, .
- 🔄 **Reverse**: Full reverse, reverse letters only
- 📦 **Duplication**: Double, Repeat 2x
- 👤 **Username**: User+123, User+@, User+1999, User@123
- 🔗 **Combining**: Add digits at end/start, CamelCase
- ☎️ **Phone**: SĐT+@, SĐT+123, SĐT+vip

### Core Features
✅ **Multi-Stage Mutations**: Chain rules with configurable depth (1-4 layers)
✅ **Custom Patterns**: Add your own suffixes, prefixes, separators
✅ **Real-time Progress**: Live progress bar during generation
✅ **Export Formats**: TXT, CSV, JSON
✅ **Entropy Detection**: Filters repetitive/weak patterns
✅ **Stop Control**: Interrupt processing anytime
✅ **Modern UI**: Dark theme with beautiful gradients
✅ **Drag & Drop**: Easy file upload

## 📋 How to Use

### 1. Prepare Input File
Create a `.txt` file with format:
```
username:password
john:mypass123
admin:pass@2024
```

### 2. Upload File
- Click upload area or drag & drop
- File will be parsed and counted

### 3. Select Mode

#### **Basic Rules**
- Choose individual rules from 12 categories
- Apply single-layer mutations
- Fast generation

#### **Advanced Mode**
- Chain multiple rules together
- Set mutation depth (1-4 layers)
- More variants but slower

#### **Custom Patterns**
- Add custom suffixes (e.g., _2024, .pro)
- Add custom prefixes (e.g., vn_, admin_)
- Add custom separators (_, -, .)

### 4. Configure Settings
- **Mutation Depth**: 1-4 (affects Advanced mode)
- **Chunk Size**: Process lines per batch
- **Max Results**: Limit total variants
- **Export Format**: Choose output format

### 5. Generate & Export
- Click Generate button
- View preview (1000 lines)
- Download or copy results

## 🔧 Technical Details

### Input Format
```
username:password
```
- Username before first `:` 
- Password after first `:` (supports colons in password)
- Each pair on new line

### Output Format

**TXT** (default):
```
username:variant1
username:variant2
```

**CSV**:
```
username,password
"user","variant1"
"user","variant2"
```

**JSON**:
```json
[
  {"username": "user", "password": "variant1"},
  {"username": "user", "password": "variant2"}
]
```

### Entropy Detection
Filters out weak patterns:
- Repeated characters (aaaa, 1111)
- Repeated sequences (abcabc, 123123)
- Maximum length: 20 characters

## ⚙️ Settings

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| **Mutation Depth** | 1-4 | 2 | Number of transformation layers |
| **Chunk Size** | 100-5000 | 500 | Lines processed per batch |
| **Max Results** | 1000-1000000 | 100000 | Maximum variants to generate |
| **Export Format** | txt/csv/json | txt | Output file format |

## 📊 Statistics

The tool displays:
- **Input Files**: Number of username:password pairs
- **Generated**: Total variants created
- **Expansion**: Ratio (variants/input pairs)

## 🚀 Performance Tips

1. **Increase Chunk Size** for faster processing of large files
2. **Reduce Max Results** to limit output
3. **Use Basic Mode** for single-layer mutations (faster)
4. **Lower Mutation Depth** to reduce processing time

## 🔒 Privacy

- All processing happens **client-side**
- No data sent to servers
- File never leaves your browser

## 📝 License

Created by [@teddyvrp](https://github.com/teddy2020912-svg)

© 2026 Password Variant Generator PRO v2.0
