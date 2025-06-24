/* global window */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';

class Particle {
  constructor(canvas, ctx, options = {}) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    this.x = options.x || Math.random() * canvas.width;
    this.y = options.y || Math.random() * canvas.height;
    
    this.vx = options.vx || (Math.random() - 0.5) * 2;
    this.vy = options.vy || (Math.random() - 0.5) * 2;
    
    this.radius = options.radius || Math.random() * 2 + 1;
    
    this.baseColor = options.color || '#ffffff';
    this.alpha = options.alpha || Math.random() * 0.5 + 0.5;
    
    this.originalRadius = this.radius;
    this.targetRadius = this.radius;
    
    this.fillColor = this.baseColor;
  }
  
  update(mouseX, mouseY) {
    // 移动粒子
    this.x += this.vx;
    this.y += this.vy;
    
    // 边界检查
    if (this.x < 0 || this.x > this.canvas.width) {
      this.vx = -this.vx;
    }
    
    if (this.y < 0 || this.y > this.canvas.height) {
      this.vy = -this.vy;
    }
    
    // 鼠标交互
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 鼠标靠近时，粒子会被推开
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        const force = (100 - distance) / 100;
        
        this.vx -= Math.cos(angle) * force * 0.2;
        this.vy -= Math.sin(angle) * force * 0.2;
        
        // 限制最大速度
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 5) {
          this.vx = (this.vx / speed) * 5;
          this.vy = (this.vy / speed) * 5;
        }
        
        // 鼠标靠近时，粒子变大
        this.targetRadius = this.originalRadius * (1 + force);
      } else {
        // 恢复原始大小
        this.targetRadius = this.originalRadius;
      }
    }
    
    // 平滑过渡到目标大小
    this.radius += (this.targetRadius - this.radius) * 0.1;
    
    // 添加阻尼
    this.vx *= 0.99;
    this.vy *= 0.99;
  }
  
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.fillColor;
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}

class Connection {
  constructor(ctx, particle1, particle2, distance) {
    this.ctx = ctx;
    this.particle1 = particle1;
    this.particle2 = particle2;
    this.distance = distance;
  }
  
  draw() {
    const dx = this.particle1.x - this.particle2.x;
    const dy = this.particle1.y - this.particle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.distance) {
      const opacity = 1 - (distance / this.distance);
      this.ctx.beginPath();
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.particle1.x, this.particle1.y);
      this.ctx.lineTo(this.particle2.x, this.particle2.y);
      this.ctx.stroke();
    }
  }
}

const InteractiveBanner = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const connectionsRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let connections = [];
    let animationFrameId;
    
    // 设置canvas大小
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // 重新创建粒子
      initParticles();
    };
    
    // 初始化粒子
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
      
      for (let i = 0; i < particleCount; i++) {
        const colors = ['#4f46e5', '#3b82f6', '#06b6d4', '#8b5cf6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(canvas, ctx, {
          color,
          radius: Math.random() * 3 + 1
        }));
      }
      
      particlesRef.current = particles;
      
      // 创建连接
      connections = [];
      const connectionDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          connections.push(new Connection(ctx, particles[i], particles[j], connectionDistance));
        }
      }
      
      connectionsRef.current = connections;
    };
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制连接
      for (const connection of connections) {
        connection.draw();
      }
      
      // 更新和绘制粒子
      for (const particle of particles) {
        particle.update(mouseRef.current.x, mouseRef.current.y);
        particle.draw();
      }
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    // 鼠标事件处理
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };
    
    // 添加事件监听
    window.addEventListener('resize', setCanvasSize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // 初始化
    setCanvasSize();
    animate();
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* 内容覆盖层 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">
          编程的艺术与科学
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl text-center text-blue-100 mb-10">
          在代码的海洋中探索无限可能，构建改变世界的应用
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/articles"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            浏览文章
          </Link>
          <Link
            to="/articles/create"
            className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            开始创作
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBanner; 