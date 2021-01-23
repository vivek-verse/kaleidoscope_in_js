    class Kaleidoscope{

      constructor(_at_options){
          this.HALF_PI = Math.PI / 2;
          this.TWO_PI = Math.PI * 2;
          this.options = _at_options != null ? _at_options : {};
          this.defaults = {
            offsetRotation: 0.0,
            offsetScale: 1.0,
            offsetX: 0.0,
            offsetY: 0.0,
            radius: 350,
            slices: 6,
            zoom: 1.0
          };

          Object.assign(this, this.defaults);
          Object.assign(this, this.options);

          if (this.domElement == null) {
            this.domElement = document.createElement('canvas');
          }
          if (this.context == null) {
            this.context = this.domElement.getContext('2d');
          }
          if (this.image == null) {
            this.image = document.createElement('img');
          }

      }

      draw(){
        var cx, scale, step, _results;
        this.domElement.width = this.domElement.height = this.radius * 2;
        this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
        scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
        step = this.TWO_PI / this.slices;
        cx = this.image.width / 2;
        _results = [];
        for (let i = 0; i < this.slices; i++) {
          this.context.save();
          this.context.translate(this.radius, this.radius);
          this.context.rotate(i * step);
          this.context.beginPath();
          this.context.moveTo(-0.5, -0.5);
          this.context.arc(0, 0, this.radius, step * -0.51, step * 0.51);
          this.context.lineTo(0.5, 0.5);
          this.context.closePath();
          this.context.rotate(this.HALF_PI);
          this.context.scale(scale, scale);
          this.context.scale([-1, 1][i % 2], 1);
          this.context.translate(this.offsetX - cx, this.offsetY);
          this.context.rotate(this.offsetRotation);
          this.context.scale(this.offsetScale, this.offsetScale);
          this.context.fill();
          _results.push(this.context.restore());
        }
        return _results;        
      }
    }


  let image = new Image;

  image.onload = (function(_this) {
    return function() {
      return kaleidoscope.draw();
    };
  })(this);

  image.src = './images/vivek.jpg';

  kaleidoscope = new Kaleidoscope({
    image: image,
    slices: 20
  });

  kaleidoscope.domElement.style.position = 'absolute';

  kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';

  kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';

  kaleidoscope.domElement.style.left = '50%';

  kaleidoscope.domElement.style.top = '50%';

  document.body.appendChild(kaleidoscope.domElement);

  tx = kaleidoscope.offsetX;

  ty = kaleidoscope.offsetY;

  tr = kaleidoscope.offsetRotation;

  onMouseMoved = (function(_this) {
    return function(event) {
      dx = event.pageX / window.innerWidth;
      dy = event.pageY / window.innerHeight;
      hx = dx - 0.5;
      hy = dy - 0.5;
      return tr = Math.atan2(hy, hx);
    };
  })(this);

  window.addEventListener('mousemove', onMouseMoved, false);

  options = {
    interactive: true,
    ease: 0.1
  };

  (update = (function(_this) {
    return function() {
      var delta, theta;
      if (options.interactive) {
        delta = tr - kaleidoscope.offsetRotation;
        theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * options.ease;
        kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * options.ease;
        kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * options.ease;
        kaleidoscope.draw();
      }
      return setTimeout(update, 1000 / 60);
    };
  })(this))();
