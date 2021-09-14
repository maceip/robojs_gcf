var md5 = require('blueimp-md5');
var _ = require('lodash');
const { createCanvas, loadImage } = require("canvas");
const width = 1200;
const height = 620;

const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

var startingWord = 'NodeBots';
var img;

function render(input) {
  renderHash(md5(input || ''));
}

function renderHash(hash) {
  if(!hash && hash.length < 32) {
    hash = md5(hash || '');
  }
  //strip uuid dashes
  hash = hash.replace(/\-/g, '');
  renderBuckets(getBuckets(hash));
}

function getBuckets(hash) {
  var b = new Buffer(hash, 'hex');
  var pairs = _.reduce(b, function(result, value, key) {
      if(key % 2) {
        result.push([b[key-1], b[key]]);
        return result;
      }
      return result;
  }, []);
  return _.map(pairs, function(val) {
    return ((val[0] << 8) + val[1]) % 10;
  });
}

function renderBuckets(buckets) {
  console.log(buckets);

  var bodyStyle = buckets[0];
  var headStyle = buckets[1];
  var eyeStyle = buckets[2];
  var mouthStyle = buckets[3];
  var accStyle = buckets[4];
  var bhColor = buckets[5];
  var emColor = buckets[6];
  var accColor = buckets[7];


  if(img) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(img, 300 * bodyStyle, 1500 * bhColor + 900, 300, 300, 0, 0, 300, 300);
    context.drawImage(img, 300 * headStyle, 1500 * bhColor + 1200, 300, 300, 0, 0, 300, 300);
    context.drawImage(img, 300 * mouthStyle, 1500 * emColor, 300, 300, 0, 0, 300, 300);
    context.drawImage(img, 300 * eyeStyle, 1500 * emColor + 300, 300, 300, 0, 0, 300, 300);
    context.drawImage(img, 300 * accStyle, 1500 * accColor + 600, 300, 300, 0, 0, 300, 300);
  }
}


global.render = render;
global.renderHash = renderHash;


exports.helloGET = (req, res) => {
  loadImage("./set1.png").then((image) => {
  render("somehash!");
	});
  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
};

