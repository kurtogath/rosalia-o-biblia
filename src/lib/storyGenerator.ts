// lib/story-generator.ts
// Genera una imagen para compartir en RRSS

export async function generateStoryImage(
    correctAnswers: number,
    totalQuestions: number,
    backgroundImageUrl: string = '/sabanas.png'
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
  
    // Tamaño de Instagram Stories (9:16)
    canvas.width = 1080;
    canvas.height = 1920;
  
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#a51d29');
    gradient.addColorStop(1, '#0077b5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    try {
      const bgImage = await loadImage(backgroundImageUrl);
      const imgSize = 700;
      const imgX = (canvas.width - imgSize) / 2;
      const imgY = 300;
      
      // Sombra para la imagen
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;
      
      // Dibujar imagen con bordes redondeados
      roundedImage(ctx, imgX, imgY, imgSize, imgSize, 20, bgImage);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  
    // Título superior
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¿Letra de Rosalía o versículo de la Biblia?', canvas.width / 2, 200);
  
    //Imagen
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("", canvas.width / 2, 1420);

    // Puntuación
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Mi puntuación: ${correctAnswers}/${totalQuestions} (${percentage}%)🎯`, canvas.width / 2, 1200);
  
    // Link del juego
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const url = "https://rosalia.unkedition.com"
    ctx.fillText(url.replace('https://', '').replace('http://', ''), canvas.width / 2, 1400);
  
    // Logo UNK al final
    try {
      const logo = await loadImage('/unk-logo-share.png');
      const logoSize = 250;
      const logoX = (canvas.width - logoSize) / 2;
      const logoY = canvas.height - 400;
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    } catch (error) {
      // Si no hay logo, mostrar texto
      ctx.font = 'bold 40px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('UNK', canvas.width / 2, canvas.height - 200);
    }
  
    // Convertir canvas a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
  
  // Helper: Cargar imagen
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
  
  // Helper: Dibujar imagen con bordes redondeados
  function roundedImage(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    image: HTMLImageElement
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
  }
  
  // Función para descargar la imagen
  export function downloadImage(blob: Blob, filename: string = 'rosalia-biblia-result.png') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Función para compartir en Instagram Stories (solo móvil)
  export async function shareToInstagramStories(blob: Blob) {
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], 'rosalia-biblia-result.png', { 
          type: 'image/png' 
        });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mi resultado en Rosalía o la Biblia',
            text: '¿Puedes superarme? https://rosalia.unkedition.com/',
          });
          return;
        }
      } catch (error) {
        console.log('Share cancelled or error:', error);
      }
    }
    
    // Fallback: descargar si no funciona
    downloadImage(blob);
    alert('Imagen descargada. Ábrela en tu galería 📱');
  }