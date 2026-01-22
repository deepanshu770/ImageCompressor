# 📦 Image Compressor

A powerful React.js application for batch image compression with ZIP file download. Efficiently compress 800+ images (13-15MB each) locally in your browser and download them as a single ZIP file.

![Image Compressor](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- **Batch Processing**: Handle 800+ files in a single batch
- **Large File Support**: Process files sized 13-15MB efficiently
- **Client-Side Compression**: Fast localhost processing with no server required
- **Configurable Settings**: 
  - Compression quality slider (0.1 - 1.0, default: 0.8)
  - Max file size control (default: 2MB per compressed image)
- **ZIP Download**: All processed images packed into a single ZIP file
- **File Format Support**: JPG and PNG images

### User Interface
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **File Input Button**: Alternative upload method
- **Real-Time Progress**: 
  - Individual file progress tracking
  - Overall batch progress bar
  - Current file indicator
  - Files completed counter (e.g., "45/800 files compressed")
- **Modern Design**: Clean, responsive interface with gradient background
- **Visual Feedback**: Success/error notifications, disabled states during processing

### Performance Optimization
- **Web Workers**: Utilizes browser-image-compression with web workers for non-blocking UI
- **Memory Efficient**: Optimized for large batches without crashing
- **Streaming ZIP Generation**: Progress updates during ZIP creation
- **Error Handling**: Continues processing even if individual files fail

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deepanshu770/ImageCompressor.git
cd ImageCompressor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

The application will automatically open in your default browser.

## 📖 How to Use

### Basic Usage

1. **Select Files**:
   - **Drag & Drop**: Drag your JPG/PNG files onto the drop zone
   - **File Input**: Click "Choose Files" button to select files from your computer
   - The app will automatically filter for valid image files

2. **Configure Settings** (Optional):
   - **Quality**: Adjust the slider (10% - 100%) to control compression quality
     - Higher quality = larger file size, better image quality
     - Lower quality = smaller file size, faster processing
   - **Max File Size**: Set the target size for each compressed image (0.5MB - 10MB)

3. **Compress & Download**:
   - Click the "Compress & Download ZIP" button
   - Watch the real-time progress as files are processed
   - The ZIP file will automatically download when complete

4. **Clear**: Click "Clear" to remove selected files and start over

### Progress Tracking

During processing, you'll see:
- **Current Progress**: "Processing: 45/800 files"
- **Percentage**: Visual progress bar with percentage
- **Current File**: Name of the file currently being processed
- **Success Notification**: Final statistics including ZIP file size

### Supported File Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)

## 🔧 Technical Details

### Technologies Used
- **React 18.2.0**: Modern React with hooks (useState, useCallback, useRef)
- **browser-image-compression 2.0.2**: Client-side image compression with web workers
- **jszip 3.10.1**: ZIP file creation in the browser
- **file-saver 2.0.5**: Reliable file download mechanism

### Project Structure
```
ImageCompressor/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

### Available Scripts

#### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

The page will reload when you make changes. You may also see lint errors in the console.

#### `npm run build`
Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

#### `npm test`
Launches the test runner in interactive watch mode.

## 💡 Performance Tips

### For Large Batches (800+ files)
1. **Lower Quality Settings**: Use 60-80% quality for faster processing
2. **Reduce Max File Size**: Set to 1-2MB for significant size reduction
3. **Be Patient**: Processing 800 files may take 10-20 minutes depending on your hardware
4. **Close Other Tabs**: Free up browser memory for better performance
5. **Use Chrome/Edge**: These browsers tend to handle large batches better

### Expected Performance
- **Single File**: ~0.5-2 seconds per file (depending on size and settings)
- **800 Files @ 13-15MB each**: 
  - Compression: ~10-20 minutes
  - ZIP Creation: ~2-5 minutes
  - Final ZIP size: ~200MB-800MB (depending on quality settings)

### Memory Considerations
- The app processes one file at a time to manage memory efficiently
- Large batches (800+) may use 2-4GB of browser memory
- If the browser crashes, try processing in smaller batches (200-300 files)

## 🎨 Compression Settings Explained

### Quality (0.1 - 1.0)
- **0.8-1.0**: High quality, minimal compression (~70-90% original size)
- **0.5-0.7**: Medium quality, good compression (~40-60% original size)
- **0.1-0.4**: Low quality, maximum compression (~10-30% original size)

### Max File Size
- Target size for each compressed image
- If an image is smaller than this after compression, it's left as-is
- If larger, additional compression is applied to meet the target
- Useful for ensuring consistent file sizes across all images

## 🐛 Troubleshooting

### Browser Crashes or Freezes
- **Solution**: Reduce batch size or lower quality settings
- Try processing 200-300 files at a time instead of 800+

### ZIP Download Fails
- **Solution**: Check browser download settings and available disk space
- Large ZIP files (1GB+) may take time to generate

### Some Files Not Compressing
- **Solution**: Check console for errors
- Corrupted images or unsupported formats will be skipped
- The app continues processing other files

### Slow Performance
- **Solution**: 
  - Close unnecessary browser tabs
  - Disable browser extensions
  - Use a modern browser (Chrome, Edge, Firefox)
  - Ensure sufficient RAM available

## 📝 Error Handling

The application handles errors gracefully:
- **Invalid File Types**: Automatically filtered out with warning notification
- **Compression Failures**: Individual file errors logged, processing continues
- **ZIP Generation Errors**: Caught and displayed to user
- **Memory Issues**: Browser may show warnings before crashing

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server Upload**: Files never leave your computer
- **No Data Collection**: No analytics or tracking
- **Secure**: No external API calls or data transmission

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - Excellent image compression library
- [JSZip](https://stuk.github.io/jszip/) - Powerful ZIP file creation
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) - Reliable file download solution

## 📞 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Open an issue on GitHub with details

---

Made with ❤️ for efficient image processing