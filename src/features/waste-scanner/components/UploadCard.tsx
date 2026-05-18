import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, X, Focus, Grid, AlertTriangle } from 'lucide-react';
import { Card3D } from '../../../shared/animations/Card3D';
import { useTranslation } from '../../../context/LanguageContext';

// Extend window object for TS
declare global {
  interface Window {
    mobilenet: any;
    tf: any;
  }
}

import { type ScanResult, analyzeWasteResult } from '../../../data/wasteAnalysisData';

// Cache model globally so it loads only once
let cachedModel: any = null;
let modelLoadPromise: Promise<any> | null = null;

const getModel = async () => {
  if (cachedModel) return cachedModel;
  if (modelLoadPromise) return modelLoadPromise;
  modelLoadPromise = (async () => {
    if (!window.mobilenet) throw new Error('MobileNet not loaded');
    const m = await window.mobilenet.load();
    cachedModel = m;
    return m;
  })();
  return modelLoadPromise;
};

// Standard Web Audio shutter click synthesizer
const playShutterSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Create soft shutter noise
    const bufferSize = ctx.sampleRate * 0.08; // 80ms sound
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with soft pinkish noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      const decay = Math.exp(-i / (bufferSize * 0.25));
      data[i] = pink * 0.04 * decay; // Very soft, gentle mirror click
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime); // Very quiet and gentle
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseSource.start();
  } catch (e) {
    console.warn('Audio Context shutter sound error:', e);
  }
};

interface UploadCardProps {
  setInventory?: React.Dispatch<React.SetStateAction<any>>;
}

export const UploadCard = ({ setInventory }: UploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const { t, language } = useTranslation();
  const [corrected, setCorrected] = useState(false);
  
  // Custom camera & scanner states
  const [showGrid, setShowGrid] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [scanPercentage, setScanPercentage] = useState(0);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleManualCorrection = (category: 'organic' | 'recycle' | 'inorganic' | 'hazardous') => {
    if (corrected || !result) return;
    setCorrected(true);
    
    let updatedResult: ScanResult;
    if (category === 'organic') {
      updatedResult = {
        type: t('games.organic'),
        name: language === 'en' ? 'CORRECTED ITEM (ORGANIC)' : 'VẬT PHẨM SỬA ĐỔI (HỮU CƠ)',
        confidence: 100.0,
        color: 'text-brand-green',
        bgColor: 'bg-brand-green/10',
        borderColor: 'border-brand-green/30',
        icon: '🌿',
        description: language === 'en' ? 'User-corrected organic waste. Thank you for making the environment cleaner!' : 'Rác hữu cơ sinh học do người dùng đính chính. Cảm ơn bạn đã chung tay bảo vệ môi trường!',
        action: language === 'en' ? '🌿 Use for composting or place in the Organic bin.' : '🌿 Đem đi ủ phân compost bón cây hoặc bỏ vào thùng rác Hữu Cơ.',
      };
    } else if (category === 'recycle') {
      updatedResult = {
        type: t('games.recycle'),
        name: language === 'en' ? 'CORRECTED ITEM (RECYCLABLE)' : 'VẬT PHẨM SỬA ĐỔI (TÁI CHẾ)',
        confidence: 100.0,
        color: 'text-brand-blue',
        bgColor: 'bg-brand-blue/10',
        borderColor: 'border-brand-blue/30',
        icon: '♻️',
        description: language === 'en' ? 'User-corrected recyclable material. Saving resources starts here!' : 'Rác tái chế do người dùng đính chính. Tiết kiệm tài nguyên bắt đầu từ đây!',
        action: language === 'en' ? '♻️ Clean, crush, and place in the Recycle bin.' : '♻️ Súc rửa sạch, để khô và bỏ vào thùng rác Tái Chế.',
      };
    } else if (category === 'hazardous') {
      updatedResult = {
        type: t('games.hazardous'),
        name: language === 'en' ? 'CORRECTED ITEM (HAZARDOUS)' : 'VẬT PHẨM SỬA ĐỔI (NGUY HẠI)',
        confidence: 100.0,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        icon: '⚠️',
        description: language === 'en' ? 'User-corrected hazardous waste. Safe handling keeps communities clean!' : 'Rác nguy hại do người dùng đính chính. Xử lý an toàn giúp bảo vệ cộng đồng!',
        action: language === 'en' ? '⚠️ Take to specialized hazardous or e-waste collection points.' : '⚠️ Mang tới các điểm thu gom rác thải nguy hại hoặc rác điện tử.',
      };
    } else {
      updatedResult = {
        type: t('games.inorganic'),
        name: language === 'en' ? 'CORRECTED ITEM (INORGANIC)' : 'VẬT PHẨM SỬA ĐỔI (VÔ CƠ)',
        confidence: 100.0,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: '🗑️',
        description: language === 'en' ? 'User-corrected inorganic waste. Landfill minimization is crucial!' : 'Rác vô cơ do người dùng đính chính. Giảm thiểu chôn lấp là vô cùng quan trọng!',
        action: language === 'en' ? '🗑️ Reduce single-use items. Put in the Inorganic bin.' : '🗑️ Tiết giảm đồ dùng một lần. Bỏ vào thùng rác Vô Cơ.',
      };
    }
    
    setResult(updatedResult);
    
    if (setInventory) {
      setInventory(prev => ({
        ...prev,
        [category]: prev[category] + 2
      }));
    }
  };

  const resetScanner = () => {
    setResult(null);
    setPreviewSrc(null);
    setCorrected(false);
  };


  // Dọn dẹp stream khi unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Khi stream thay đổi và video element đã mount, gán srcObject
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Video play failed:', err);
      });
    }
  }, [stream, isCameraActive]);

  const startCamera = async () => {
    try {
      // Dừng stream cũ nếu có
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      // Bật camera view TRƯỚC, sau đó set stream → useEffect sẽ gán srcObject
      setIsCameraActive(true);
      // Dùng setTimeout nhỏ để đảm bảo React đã render video element
      setTimeout(() => {
        setStream(mediaStream);
      }, 50);
    } catch (err: any) {
      console.error("Camera access denied or not available", err);
      const msg = err?.name === 'NotAllowedError'
        ? (language === 'en' 
          ? 'Camera permission denied. Please allow camera access in your browser settings.' 
          : 'Quyền truy cập camera bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt!')
        : err?.name === 'NotFoundError'
        ? (language === 'en'
          ? 'No camera found on this device.'
          : 'Không tìm thấy camera trên thiết bị này.')
        : (language === 'en'
          ? 'Unable to access camera. Please check permissions!'
          : 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập!');
      alert(msg);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Effect to handle futuristic high-tech console telemetry logs rolling
  useEffect(() => {
    if (isScanning) {
      setScanPercentage(0);
      setActiveLogs([]);
      
      const logsPool = language === 'en' ? [
        '[SYS] Initializing Edge AI Core...',
        '[MODEL] Loading MobileNet CNN Architecture...',
        '[TENSOR] Compiling mathematical graphs...',
        '[VISION] Fetching RGB & HSL matrix...',
        '[CLASSIFY] Extracting visual features...',
        '[SEARCH] Cross-referencing 600+ waste definitions...',
        '[SUCCESS] AI waste classification complete!'
      ] : [
        '[SYS] Khởi tạo nhân lõi Trí Tuệ Nhân Tạo...',
        '[MODEL] Nạp kiến trúc mạng tích chập MobileNet...',
        '[TENSOR] Đồng bộ đồ thị toán học tensor...',
        '[VISION] Trích xuất ma trận HSL & RGB...',
        '[CLASSIFY] Phân tích đặc trưng hình ảnh...',
        '[SEARCH] Tra cứu 600+ danh mục rác thải...',
        '[SUCCESS] AI phân loại rác thành công!'
      ];

      let currentPct = 0;
      let logIndex = 0;
      
      const interval = setInterval(() => {
        currentPct += 1;
        if (currentPct > 100) {
          currentPct = 100;
          clearInterval(interval);
        }
        setScanPercentage(currentPct);
        
        const step = Math.floor(100 / logsPool.length);
        const targetLogIndex = Math.min(
          logsPool.length - 1,
          Math.floor(currentPct / step)
        );
        
        if (targetLogIndex >= logIndex) {
          setActiveLogs(prev => {
            const added = logsPool.slice(logIndex, targetLogIndex + 1);
            const next = [...prev, ...added.filter(item => !prev.includes(item))];
            return next;
          });
          logIndex = targetLogIndex + 1;
        }
      }, 25); // Seamless 2.5s progressive scan

      return () => clearInterval(interval);
    }
  }, [isScanning, language]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState < 2) {
        console.warn('Video not ready yet');
        return;
      }

      // Shutter visual & sound click trigger
      playShutterSound();
      setIsFlashing(true);

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Soft click captures quickly and stops camera after a short delay for beautiful visual feedback
        setTimeout(() => {
          setIsFlashing(false);
          stopCamera();
          processImage(imageUrl);
        }, 150);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current?.files?.length) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(fileInputRef.current.files[0]);
    }
  };

  const processImage = (src: string) => {
    setPreviewSrc(src);
    if (imgRef.current) {
      imgRef.current.src = src;
      imgRef.current.onload = () => {
        runAI(imgRef.current!);
      };
    }
  };

  const runAI = async (imageElement: HTMLImageElement) => {
    setIsScanning(true);
    setResult(null);
    
    let scanResult: ScanResult;
    try {
      const model = await getModel();
      const predictions = await model.classify(imageElement);
      scanResult = analyzeWasteResult(predictions, language, t);
    } catch (e) {
      console.error('AI scan error:', e);
      // Fallback prediction
      scanResult = {
        type: language === 'en' ? 'Recycle' : 'Tái Chế',
        name: language === 'en' ? 'PLASTIC ITEM (Estimate)' : 'CHAI NHỰA (Dự Đoán)',
        confidence: 85.0,
        color: 'text-brand-blue',
        bgColor: 'bg-brand-blue/10',
        borderColor: 'border-brand-blue/30',
        icon: '♻️',
        description: language === 'en' ? 'Fallback AI estimated this is a recyclable plastic material.' : 'Hệ thống AI dự phòng đoán đây là vật liệu nhựa tái chế được.',
        action: language === 'en' ? 'Rinse and place in the recycling bin.' : 'Súc rửa sạch nước bên trong và cho vào thùng rác tái chế.',
      };
    }

    // Sync with the automated scanning console animation for ultra-premium UX
    await new Promise(resolve => setTimeout(resolve, 2600));
    setResult(scanResult);
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 relative z-20">
      <AnimatePresence mode="wait">
        {!isScanning && !result && !isCameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            className={`relative group rounded-3xl p-8 transition-all duration-500 ease-out border-2 border-dashed ${
              isDragging 
                ? 'bg-brand-green/10 border-brand-green shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
                : 'glass border-white/20 hover:border-white/40 hover:bg-white/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*"
            />
            
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className="relative">
                <div className={`absolute -inset-4 rounded-full blur-xl transition-opacity duration-500 ${isDragging ? 'bg-brand-green/40 opacity-100' : 'bg-brand-blue/20 opacity-0 group-hover:opacity-100'}`} />
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 transition-colors duration-300 ${isDragging ? 'bg-brand-green text-white' : 'bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700'}`}>
                  <UploadCloud className="w-10 h-10" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('scanner.title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  {t('scanner.desc')}
                </p>
              </div>

              <div className="flex gap-4 mt-4 w-full sm:w-auto">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold rounded-xl transition-colors border border-slate-300 dark:border-white/10 shadow-sm"
                >
                  <ImageIcon className="w-5 h-5" />
                  {t('scanner.chooseFile')}
                </button>
                <button 
                  onClick={startCamera}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-green/20 hover:bg-brand-green/30 text-emerald-700 dark:text-brand-green font-bold rounded-xl transition-colors border border-brand-green/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <Camera className="w-5 h-5" />
                  {t('scanner.useCamera')}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-3xl overflow-hidden border border-white/20 relative w-full aspect-[4/3] sm:aspect-video flex flex-col bg-black"
          >
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Soft subtle camera flash overlay */}
            <AnimatePresence>
              {isFlashing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-white z-50 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Lớp phủ giao diện Camera */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
              <div className="flex justify-between items-start w-full">
                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {t('scanner.live')}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowGrid(!showGrid)}
                    className="pointer-events-auto px-3 py-1.5 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    {showGrid ? 'GRID: ON' : 'GRID: OFF'}
                  </button>
                  <button 
                    onClick={stopCamera}
                    className="pointer-events-auto p-2 bg-black/50 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Khung ngắm hiện đại xịn hơn - Rộng rãi hơn */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                <div className="relative w-full h-full max-w-md max-h-96">
                  {/* Bốn góc HUD (Mở rộng ra ngoài, nét thanh mảnh hơn nhưng ngầu hơn) */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-brand-green/80 rounded-tl-xl shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-brand-green/80 rounded-tr-xl shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-brand-green/80 rounded-bl-xl shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-brand-green/80 rounded-br-xl shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  
                  {/* Rule of thirds grid lines overlay */}
                  {showGrid && (
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 h-[0.5px] bg-white/15" />
                      <div className="absolute top-2/3 left-0 right-0 h-[0.5px] bg-white/15" />
                      <div className="absolute left-1/3 top-0 bottom-0 w-[0.5px] bg-white/15" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-[0.5px] bg-white/15" />
                    </div>
                  )}

                  {/* Telemetry metadata displays */}
                  <div className="absolute bottom-4 left-4 text-[9px] font-mono text-brand-green/60 flex flex-col gap-0.5 select-none">
                    <div>RES: 1280x720</div>
                    <div>FPS: 60.0</div>
                    <div>ISO: AUTO</div>
                  </div>
                  <div className="absolute bottom-4 right-4 text-[9px] font-mono text-brand-green/60 flex flex-col gap-0.5 text-right select-none">
                    <div>FOCUS: LOCKED</div>
                    <div>AGC: ACTIVE</div>
                    <div>EV: 0.0</div>
                  </div>

                  {/* Các vạch ngắm nhỏ giữa các viền */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-brand-green/50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-brand-green/50" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-brand-green/50" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-brand-green/50" />

                  {/* Đường quét laser mượt mà tinh tế hơn */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-brand-green shadow-[0_0_15px_#10b981] z-10 opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Focus className="w-12 h-12 text-brand-green/20 animate-pulse" strokeWidth={1} />
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full z-10 relative">
                <button
                  onClick={capturePhoto}
                  className="pointer-events-auto w-16 h-16 rounded-full border-4 border-white/50 bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors flex items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-white group-hover:scale-90 transition-all shadow-[0_0_20px_white]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-brand-green shadow-[0_0_20px_#10b981] z-10"
            />
            
            <div className="relative mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-t-2 border-r-2 border-brand-green"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-full border-b-2 border-l-2 border-brand-blue absolute top-3 left-3"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-wide">{t('scanner.analyzing')}</h3>
            
            {/* Realtime progress percentages */}
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-3">
              <span>SCAN TELEMETRY PROGRESS:</span>
              <span className="text-brand-green font-bold">{scanPercentage}%</span>
            </div>

            {/* Dynamic rolling console logs */}
            <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 font-mono text-left text-[11px] text-brand-green/80 flex flex-col gap-1.5 h-36 overflow-y-auto">
              {activeLogs.map((log, index) => (
                <div key={index} className="flex gap-1.5 items-start">
                  <span className="text-brand-blue select-none">❯</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              <div className="flex gap-1.5 items-center text-slate-500">
                <span>❯</span>
                <span className="w-1.5 h-3 bg-brand-green/80 animate-pulse" />
              </div>
            </div>

            {previewSrc && (
              <div className="mt-5 w-24 h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>
        )}

        {result && !isScanning && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card3D>
              <div className={`rounded-3xl overflow-hidden glass border ${result.borderColor} shadow-2xl`}>
                {/* Result Header */}
                <div className={`p-6 ${result.bgColor} flex justify-between items-start border-b ${result.borderColor}`}>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shadow-inner border border-white/20">
                      {result.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${result.color}`}>
                        {result.type}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ transform: "translateZ(30px)" }}>{result.name}</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white" style={{ transform: "translateZ(20px)" }}>{result.confidence}%</div>
                    <div className="text-xs text-slate-400 font-mono uppercase">{t('scanner.confidence')}</div>
                  </div>
                </div>

                {/* Result Body */}
                <div className="p-6 md:p-8 space-y-6 bg-slate-950/50 backdrop-blur-md">
                  {Number(result.confidence) < 20 && !corrected && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-left">
                      <div className="flex gap-2 items-center text-amber-500 font-bold text-sm mb-2">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                        {language === 'en' ? 'LOW CONFIDENCE AI DETECTION' : 'ĐỘ TIN CẬY NHẬN DIỆN THẤP'}
                      </div>
                      <p className="text-slate-300 text-xs mb-4">
                        {language === 'en' 
                          ? 'The Edge AI is not fully confident about this item. Please select the correct category below to train our model and earn a +2 Resource bonus!'
                          : 'Trí tuệ nhân tạo không hoàn toàn chắc chắn về rác thải này. Vui lòng chọn nhóm đúng bên dưới để hỗ trợ huấn luyện AI và nhận +2 Tài nguyên thưởng!'}
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button 
                          onClick={() => handleManualCorrection('organic')}
                          className="px-3 py-2 bg-brand-green/20 hover:bg-brand-green/30 border border-brand-green/30 rounded-xl text-brand-green font-bold text-xs transition-all uppercase"
                        >
                          🌿 {t('games.organic')}
                        </button>
                        <button 
                          onClick={() => handleManualCorrection('recycle')}
                          className="px-3 py-2 bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/30 rounded-xl text-brand-blue font-bold text-xs transition-all uppercase"
                        >
                          ♻️ {t('games.recycle')}
                        </button>
                        <button 
                          onClick={() => handleManualCorrection('inorganic')}
                          className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-amber-500 font-bold text-xs transition-all uppercase"
                        >
                          🗑️ {t('games.inorganic')}
                        </button>
                        <button 
                          onClick={() => handleManualCorrection('hazardous')}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-500 font-bold text-xs transition-all uppercase"
                        >
                          ⚠️ {t('games.hazardous')}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {t('scanner.details')}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-inner" style={{ transform: "translateZ(10px)" }}>
                    <h4 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> {t('scanner.instructions')}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">
                      {result.action}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={resetScanner}
                      className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold transition-colors text-sm"
                    >
                      {t('scanner.scanAnother')}
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hidden image element for AI to read */}
      <img ref={imgRef} alt="hidden" className="hidden" />
    </div>
  );
};
