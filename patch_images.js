const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add DEST_PHOTOS object before DESTINATIONS array
const destPhotos = `const DEST_PHOTOS = {
  goa:       'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
  kerala:    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
  manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
  varanasi:  'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop&q=80',
  andaman:   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1585016495481-91613b441b3e?w=800&auto=format&fit=crop&q=80',
  ladakh:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
};
`;

// Insert DEST_PHOTOS before "const DESTINATIONS"
if (!html.includes('DEST_PHOTOS')) {
  html = html.replace('const DESTINATIONS = [', destPhotos + 'const DESTINATIONS = [');
  console.log('DEST_PHOTOS added');
}

// 2. Add key field to each destination entry
const destReplacements = [
  ["emoji:'\\uD83C\\uDFD6\\uFE0F',bg:'linear-gradient(135deg,#1a4a3a,#2d7a5a)'", "key:'goa'"],
  ["emoji:'\\uD83C\\uDFC0',bg:'linear-gradient(135deg,#4a2a0a,#8a5a1a)'", "key:'rajasthan'"],
  ["emoji:'\\uD83C\\uDF3F',bg:'linear-gradient(135deg,#0a3a1a,#1a6a2a)'", "key:'kerala'"],
  ["emoji:'\\uD83C\\uDFD4\\uFE0F',bg:'linear-gradient(135deg,#0a1a3a,#1a3a6a)'", "key:'manali'"],
  ["emoji:'\\uD83D\\uDD4C',bg:'linear-gradient(135deg,#3a1a0a,#6a3a0a)'", "key:'varanasi'"],
  ["emoji:'\\uD83D\\uDC20',bg:'linear-gradient(135deg,#0a2a4a,#0a4a6a)'", "key:'andaman'"],
  ["emoji:'\\uD83E\\uDDD8',bg:'linear-gradient(135deg,#1a3a0a,#3a6a1a)'", "key:'rishikesh'"],
  ["emoji:'\\uD83C\\uDFD9\\uFE0F',bg:'linear-gradient(135deg,#2a1a0a,#5a3a0a)'", "key:'ladakh'"],
];

// Use regex to replace emoji+bg with key in each destination
html = html
  .replace(/emoji:'\uD83C\uDFD6\uFE0F',bg:'linear-gradient\(135deg,#1a4a3a,#2d7a5a\)'/, "key:'goa'")
  .replace(/emoji:'\uD83C\uDFC0',bg:'linear-gradient\(135deg,#4a2a0a,#8a5a1a\)'/, "key:'rajasthan'")
  .replace(/emoji:'\uD83C\uDF3F',bg:'linear-gradient\(135deg,#0a3a1a,#1a6a2a\)'/, "key:'kerala'")
  .replace(/emoji:'\uD83C\uDFD4\uFE0F',bg:'linear-gradient\(135deg,#0a1a3a,#1a3a6a\)'/, "key:'manali'")
  .replace(/emoji:'\uD83D\uDD4C',bg:'linear-gradient\(135deg,#3a1a0a,#6a3a0a\)'/, "key:'varanasi'")
  .replace(/emoji:'\uD83D\uDC20',bg:'linear-gradient\(135deg,#0a2a4a,#0a4a6a\)'/, "key:'andaman'")
  .replace(/emoji:'\uD83E\uDDD8',bg:'linear-gradient\(135deg,#1a3a0a,#3a6a1a\)'/, "key:'rishikesh'")
  .replace(/emoji:'\uD83C\uDFD9\uFE0F',bg:'linear-gradient\(135deg,#2a1a0a,#5a3a0a\)'/, "key:'ladakh'");
console.log('Destination keys added');

// 3. Replace the forEach rendering to use real images
const oldForEach = `const destGrid = document.getElementById('destGrid');
DESTINATIONS.forEach(d=>{
  destGrid.innerHTML += \`
  <div class="dest-card" onclick="quickPlan('\${d.name}')">
    <div class="dest-placeholder" style="background:\${d.bg}">\${d.emoji}</div>
    <div class="dest-overlay"></div>
    <div class="dest-info">
      <div class="dest-tag">\${d.tag}</div>
      <div class="dest-name">\${d.name}</div>
      <div class="dest-meta">\${d.meta}</div>
    </div>
  </div>\`;
});`;

const newForEach = `const destGrid = document.getElementById('destGrid');
DESTINATIONS.forEach(d=>{
  const img = DEST_PHOTOS[d.key] || '';
  destGrid.innerHTML += '<div class="dest-card" onclick="quickPlan(\\'' + d.name + '\\')">' +
    (img ? '<img class="dest-img" src="' + img + '" alt="' + d.name + '" loading="lazy" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\'" />' : '') +
    '<div class="dest-placeholder" style="display:' + (img?'none':'flex') + ';font-size:4rem;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#0B1F33,#1E3A5F)"></div>' +
    '<div class="dest-overlay"></div>' +
    '<div class="dest-info">' +
      '<div class="dest-tag">' + d.tag + '</div>' +
      '<div class="dest-name">' + d.name + '</div>' +
      '<div class="dest-meta">' + d.meta + '</div>' +
    '</div></div>';
});`;

if (html.includes(oldForEach)) {
  html = html.replace(oldForEach, newForEach);
  console.log('forEach replaced');
} else {
  console.log('WARNING: forEach not found, trying regex');
  html = html.replace(
    /const destGrid = document\.getElementById\('destGrid'\);\nDESTINATIONS\.forEach[\s\S]*?\}\);/,
    newForEach
  );
  console.log('forEach replaced via regex');
}

// 4. Replace banner section
html = html.replace(
  /\/\/ Banner\n  const banner = document\.getElementById\('destBanner'\);[\s\S]*?`;\n/,
  `// Banner with real photo
  var destKey2 = dest.toLowerCase().replace(/\\s+/g,'');
  var bannerPhotoKey = Object.keys(DEST_PHOTOS).find(function(k){ return destKey2.includes(k) || k.includes(destKey2); });
  var banner = document.getElementById('destBanner');
  if (bannerPhotoKey) {
    banner.innerHTML = '<img src="' + DEST_PHOTOS[bannerPhotoKey] + '" alt="' + dest + '" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" loading="lazy" />' +
      '<div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(11,31,51,0.8),rgba(11,31,51,0.2));display:flex;align-items:flex-end;padding:28px">' +
        '<div><div style="font-size:3rem;margin-bottom:8px">' + data.emoji + '</div>' +
        '<div style=\\'font-family:\\"Playfair Display\\",serif;font-size:2rem;font-weight:900;color:#fff\\'>' + dest + '</div>' +
        '<div style="color:rgba(255,255,255,0.75);font-size:0.9rem;margin-top:4px">' + data.tagline + '</div></div></div>';
  } else {
    banner.style.background = 'linear-gradient(135deg,#0B1F33,#1E3A5F)';
    banner.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:flex-end;padding:28px">' +
      '<div><div style="font-size:3rem;margin-bottom:8px">' + data.emoji + '</div>' +
      '<div style=\\'font-family:\\"Playfair Display\\",serif;font-size:2rem;font-weight:900\\'>' + dest + '</div>' +
      '<div style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:4px">' + data.tagline + '</div></div></div>';
  }
`);
console.log('Banner replaced');

// 5. Replace attraction photos section
html = html.replace(
  /\/\/ Attraction photos\n  const apDiv[\s\S]*?\.join\(''\);/,
  `// Attraction photos with real images
  var ATTR_PHOTOS = {
    goa:       ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1587922546307-776227941871?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&auto=format&fit=crop&q=80'],
    rajasthan: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1548013146-72479768bada?w=300&auto=format&fit=crop&q=80'],
    kerala:    ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&auto=format&fit=crop&q=80'],
    manali:    ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&auto=format&fit=crop&q=80'],
  };
  var attrImgs = ATTR_PHOTOS[bannerPhotoKey] || [];
  var apDiv = document.getElementById('attractionPhotos');
  apDiv.innerHTML = (data.attractions||[]).slice(0,4).map(function(a,i) {
    if (attrImgs[i]) return '<div class="attraction-photo"><img src="' + attrImgs[i] + '" alt="' + a + '" style="width:100%;height:100%;object-fit:cover" loading="lazy" /><div class="attraction-photo-name">' + a + '</div></div>';
    var em = (data.attractionEmojis && data.attractionEmojis[i]) ? data.attractionEmojis[i] : '';
    return '<div class="attraction-photo"><div class="attraction-photo-placeholder"><span>' + em + '</span><span style="font-size:0.65rem">' + a + '</span></div></div>';
  }).join('');`
);
console.log('Attractions replaced');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! index.html updated with real images.');
