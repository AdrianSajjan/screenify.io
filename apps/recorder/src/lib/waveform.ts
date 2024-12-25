class AudioWaveform {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  private audioContext: AudioContext | null;
  private analyserNode: AnalyserNode | null;
  private animationFrame: number | null;

  private dataArray: Uint8Array<ArrayBuffer> | null;
  private bufferLength: number | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.dataArray = null;
    this.bufferLength = null;

    this.audioContext = null;
    this.analyserNode = null;
    this.animationFrame = null;
  }

  static createInstance(canvas: HTMLCanvasElement): AudioWaveform {
    return new AudioWaveform(canvas);
  }

  private __drawWaveform(): void {
    if (!this.analyserNode || !this.context || !this.dataArray || !this.bufferLength) return;

    this.animationFrame = requestAnimationFrame(this.__drawWaveform.bind(this));
    this.analyserNode.getByteTimeDomainData(this.dataArray);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const primary = window.getComputedStyle(document.documentElement).getPropertyValue("--primary");
    const color = `hsl(${primary})`;

    this.context.lineWidth = 4;
    this.context.strokeStyle = color;
    this.context.beginPath();

    const sliceWidth = this.canvas.width / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * this.canvas.height) / 2;

      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.context.lineTo(this.canvas.width, this.canvas.height / 2);
    this.context.stroke();
  }

  private __startDrawing(): void {
    if (!this.analyserNode || !this.context) return;

    this.bufferLength = this.analyserNode.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.__drawWaveform();
  }

  async start(constraints?: MediaStreamConstraints): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia(constraints || { audio: true });
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);

    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    source.connect(this.analyserNode);

    this.__startDrawing();
  }

  stop(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.audioContext) this.audioContext.close();

    this.animationFrame = null;
    this.audioContext = null;
    this.bufferLength = null;
    this.dataArray = null;
  }
}

export { AudioWaveform };
