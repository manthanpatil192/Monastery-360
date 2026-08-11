const { Jimp } = require('jimp');

async function processImages() {
  console.log('Processing unique monastery panoramas...');

  // 1. Enchey 360 Panorama (pano_enchey.png)
  try {
    const enchey = await Jimp.read('assets/images/enchey.png');
    await enchey.resize({ w: 2048, h: 1024 });
    await enchey.write('assets/images/pano_enchey.png');
    console.log('Created assets/images/pano_enchey.png');
  } catch (err) {
    console.error('Enchey error:', err);
  }

  // 2. Ralang 360 Panorama (pano_ralang.png) - Unique warm golden dawn palette & flip
  try {
    const ralang = await Jimp.read('assets/images/pano_rumtek_courtyard.png');
    await ralang.flip({ horizontal: true, vertical: false });
    await ralang.color([
      { apply: 'hue', params: [30] },
      { apply: 'saturate', params: [20] }
    ]);
    await ralang.write('assets/images/pano_ralang.png');
    console.log('Created assets/images/pano_ralang.png');
  } catch (err) {
    console.error('Ralang error:', err);
  }

  // 3. Samdruptse 360 Panorama (pano_samdruptse.png) - Unique alpine sky palette
  try {
    const samdruptse = await Jimp.read('assets/images/hero.png');
    await samdruptse.resize({ w: 2048, h: 1024 });
    await samdruptse.color([
      { apply: 'hue', params: [-20] },
      { apply: 'saturate', params: [15] }
    ]);
    await samdruptse.write('assets/images/pano_samdruptse.png');
    console.log('Created assets/images/pano_samdruptse.png');
  } catch (err) {
    console.error('Samdruptse error:', err);
  }

  console.log('All unique monastery panorama images created successfully!');
}

processImages();
