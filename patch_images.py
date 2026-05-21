import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace DESTINATIONS array and forEach with photo version
old_dest = '''const DESTINATIONS = [
  {name:'Goa',tag:'Beach & Party',meta:'3\u20135 days \u2022 \u20b98,000\u2013\u20b925,000',emoji:'\ud83c\udfd6\ufe0f',bg:'linear-gradient(135deg,#1a4a3a,#2d7a5a)'},
  {name:'Rajasthan',tag:'Heritage & Culture',meta:'7\u201310 days \u2022 \u20b915,000\u2013\u20b950,000',emoji:'\ud83c\udfc0',bg:'linear-gradient(135deg,#4a2a0a,#8a5a1a)'},
  {name:'Kerala',tag:'Backwaters & Nature',meta:'5\u20137 days \u2022 \u20b912,000\u2013\u20b935,000',emoji:'\ud83c\udf3f',bg:'linear-gradient(135deg,#0a3a1a,#1a6a2a)'},
  {name:'Manali',tag:'Mountains & Snow',meta:'5\u20137 days \u2022 \u20b910,000\u2013\u20b930,000',emoji:'\ud83c\udfd4\ufe0f',bg:'linear-gradient(135deg,#0a1a3a,#1a3a6a)'},
  {name:'Varanasi',tag:'Spiritual & Ghats',meta:'3\u20134 days \u2022 \u20b96,000\u2013\u20b918,000',emoji:'\ud83d\udd4c',bg:'linear-gradient(135deg,#3a1a0a,#6a3a0a)'},
  {name:'Andaman',tag:'Island & Diving',meta:'6\u20138 days \u2022 \u20b920,000\u2013\u20b960,000',emoji:'\ud83d\udc20',bg:'linear-gradient(135deg,#0a2a4a,#0a4a6a)'},
  {name:'Rishikesh',tag:'Adventure & Yoga',meta:'4\u20136 days \u2022 \u20b98,000\u2013\u20b922,000',emoji:'\ud83e\uddd8',bg:'linear-gradient(135deg,#1a3a0a,#3a6a1a)'},
  {name:'Ladakh',tag:'Desert & Peaks',meta:'7\u201310 days \u2022 \u20b920,000\u2013\u20b955,000',emoji:'\ud83c\udfd9\ufe0f',bg:'linear-gradient(135deg,#2a1a0a,#5a3a0a)'},
];
 
const destGrid = document.getElementById('destGrid');
DESTINATIONS.forEach(d=>{
  destGrid.innerHTML += `
  <div class="dest-card" onclick="quickPlan('${d.name}')">
    <div class="dest-placeholder" style="background:${d.bg}">${d.emoji}</div>
    <div class="dest-overlay"></div>
    <div class="dest-info">
      <div class="dest-tag">${d.tag}</div>
      <div class="dest-name">${d.name}</div>
      <div class="dest-meta">${d.meta}</div>
    </div>
  </div>`;
});'''

new_dest = '''const DEST_PHOTOS = {
  goa:       'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
  kerala:    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
  manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
  varanasi:  'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop&q=80',
  andaman:   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1585016495481-91613b441b3e?w=800&auto=format&fit=crop&q=80',
  ladakh:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
};
const DESTINATIONS = [
  {name:'Goa',       tag:'Beach & Party',      meta:'3\u20135 days \u2022 \u20b98,000\u2013\u20b925,000',  key:'goa'},
  {name:'Rajasthan', tag:'Heritage & Culture', meta:'7\u201310 days \u2022 \u20b915,000\u2013\u20b950,000', key:'rajasthan'},
  {name:'Kerala',    tag:'Backwaters & Nature',meta:'5\u20137 days \u2022 \u20b912,000\u2013\u20b935,000', key:'kerala'},
  {name:'Manali',    tag:'Mountains & Snow',   meta:'5\u20137 days \u2022 \u20b910,000\u2013\u20b930,000', key:'manali'},
  {name:'Varanasi',  tag:'Spiritual & Ghats',  meta:'3\u20134 days \u2022 \u20b96,000\u2013\u20b918,000',  key:'varanasi'},
  {name:'Andaman',   tag:'Island & Diving',    meta:'6\u20138 days \u2022 \u20b920,000\u2013\u20b960,000', key:'andaman'},
  {name:'Rishikesh', tag:'Adventure & Yoga',   meta:'4\u20136 days \u2022 \u20b98,000\u2013\u20b922,000',  key:'rishikesh'},
  {name:'Ladakh',    tag:'Desert & Peaks',     meta:'7\u201310 days \u2022 \u20b920,000\u2013\u20b955,000', key:'ladakh'},
];
 
const destGrid = document.getElementById('destGrid');
DESTINATIONS.forEach(d=>{
  const img = DEST_PHOTOS[d.key];
  destGrid.innerHTML += '<div class="dest-card" onclick="quickPlan(\\'' + d.name + '\\')">' +
    '<img class="dest-img" src="' + img + '" alt="' + d.name + '" loading="lazy" ' +
      'onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\'" />' +
    '<div class="dest-placeholder" style="display:none;font-size:4rem;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#0B1F33,#1E3A5F)"></div>' +
    '<div class="dest-overlay"></div>' +
    '<div class="dest-info">' +
      '<div class="dest-tag">' + d.tag + '</div>' +
      '<div class="dest-name">' + d.name + '</div>' +
      '<div class="dest-meta">' + d.meta + '</div>' +
    '</div></div>';
});'''

if old_dest in html:
    html = html.replace(old_dest, new_dest)
    print("Destinations replaced OK")
else:
    print("ERROR: destinations block not found")

# 2. Replace banner section
old_banner = """  // Banner
  const banner = document.getElementById('destBanner');
  banner.style.background = data.bg || 'linear-gradient(135deg, var(--forest), var(--dusk))';
  banner.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:flex-end;justify-content:flex-start;padding:28px;background:linear-gradient(to right,rgba(15,26,10,0.75),transparent)">
    <div>
      <div style="font-size:3rem;margin-bottom:8px">${data.emoji}</div>
      <div style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:900">${dest}</div>
      <div style="color:rgba(245,236,215,0.7);font-size:0.9rem;margin-top:4px">${data.tagline}</div>
    </div>
  </div>`;"""

new_banner = """  // Banner with real photo
  var destKey2 = dest.toLowerCase().replace(/\\s+/g,'');
  var bannerPhotoKey = Object.keys(DEST_PHOTOS).find(function(k){ return destKey2.includes(k) || k.includes(destKey2); });
  var banner = document.getElementById('destBanner');
  if (bannerPhotoKey) {
    banner.innerHTML = '<img src="' + DEST_PHOTOS[bannerPhotoKey] + '" alt="' + dest + '" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" loading="lazy" />' +
      '<div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(11,31,51,0.8),rgba(11,31,51,0.2));display:flex;align-items:flex-end;padding:28px">' +
        '<div><div style="font-size:3rem;margin-bottom:8px">' + data.emoji + '</div>' +
        '<div style="font-family:\\'Playfair Display\\',serif;font-size:2rem;font-weight:900;color:#fff">' + dest + '</div>' +
        '<div style="color:rgba(255,255,255,0.75);font-size:0.9rem;margin-top:4px">' + data.tagline + '</div></div>' +
      '</div>';
  } else {
    banner.style.background = 'linear-gradient(135deg,#0B1F33,#1E3A5F)';
    banner.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:flex-end;padding:28px;background:linear-gradient(to right,rgba(11,31,51,0.8),transparent)">' +
      '<div><div style="font-size:3rem;margin-bottom:8px">' + data.emoji + '</div>' +
      '<div style="font-family:\\'Playfair Display\\',serif;font-size:2rem;font-weight:900">' + dest + '</div>' +
      '<div style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:4px">' + data.tagline + '</div></div></div>';
  }"""

if old_banner in html:
    html = html.replace(old_banner, new_banner)
    print("Banner replaced OK")
else:
    print("ERROR: banner block not found")

# 3. Replace attraction photos section
old_attr = """  // Attraction photos
  const apDiv = document.getElementById('attractionPhotos');
  apDiv.innerHTML = (data.attractions||[]).slice(0,4).map((a,i)=>`
    <div class="attraction-photo">
      <div class="attraction-photo-placeholder">
        <span>${data.attractionEmojis?.[i]||'\U0001f4cd'}</span>
        <span>${a}</span>
      </div>
    </div>`).join('');"""

new_attr = """  // Attraction photos with real images
  var ATTR_PHOTOS = {
    goa:       ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1587922546307-776227941871?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&auto=format&fit=crop&q=80'],
    rajasthan: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&auto=format&fit=crop&q=80'],
    kerala:    ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&auto=format&fit=crop&q=80'],
    manali:    ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&auto=format&fit=crop&q=80'],
  };
  var attrImgs = ATTR_PHOTOS[bannerPhotoKey] || [];
  var apDiv = document.getElementById('attractionPhotos');
  apDiv.innerHTML = (data.attractions||[]).slice(0,4).map(function(a,i) {
    if (attrImgs[i]) {
      return '<div class="attraction-photo">' +
        '<img src="' + attrImgs[i] + '" alt="' + a + '" style="width:100%;height:100%;object-fit:cover" loading="lazy" />' +
        '<div class="attraction-photo-name">' + a + '</div></div>';
    }
    var em = (data.attractionEmojis && data.attractionEmojis[i]) ? data.attractionEmojis[i] : '';
    return '<div class="attraction-photo"><div class="attraction-photo-placeholder">' +
      '<span>' + em + '</span><span style="font-size:0.65rem">' + a + '</span></div></div>';
  }).join('');"""

if old_attr in html:
    html = html.replace(old_attr, new_attr)
    print("Attractions replaced OK")
else:
    print("ERROR: attractions block not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done!")
