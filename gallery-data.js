/* eslint-disable no-var */
// Placeholder gallery data.
// When you have the real 50+ photos, replace `src` with your file paths (ex: "assets/photos/IMG_0001.webp"),
// and adjust `tags` to match the filter buttons in `gallery.html`.

(function () {
  var base = 'https://placehold.co/1200x900?text=Project+Photo+';

  var make = function (n, title, tags) {
    return {
      src: base + String(n),
      alt: 'Placeholder project photo ' + String(n),
      title: title,
      tags: tags,
    };
  };

  // Expose globally (simple static-site approach).
  // script.js will render this into #galleryGrid when data-gallery-source="js".
  window.GALLERY_ITEMS = [
    make(1, 'Weekly route finish', ['maintenance']),
    make(2, 'Fresh mulch + edging', ['beds']),
    make(3, 'Season reset cleanup', ['cleanup']),
    make(4, 'Border upgrade detail', ['hardscape']),
    make(5, 'Planting refresh', ['beds']),
    make(6, 'Clean lines & edges', ['maintenance']),
    make(7, 'Leaf removal', ['cleanup']),
    make(8, 'Walkway refresh', ['hardscape']),
    make(9, 'Bed definition', ['beds']),
    make(10, 'Trim + tidy', ['maintenance']),
    make(11, 'Spring cleanup', ['cleanup']),
    make(12, 'Stone border touch', ['hardscape']),
    make(13, 'Mulch refresh', ['beds']),
    make(14, 'Weekly maintenance', ['maintenance']),
    make(15, 'Fall cleanup', ['cleanup']),
    make(16, 'Paver reset', ['hardscape']),
    make(17, 'Color planting', ['beds']),
    make(18, 'Crisp edging', ['maintenance']),
    make(19, 'Debris haul-away', ['cleanup']),
    make(20, 'Gravel path refresh', ['hardscape']),
    make(21, 'Bed cleanup + mulch', ['beds']),
    make(22, 'Mow + trim finish', ['maintenance']),
    make(23, 'Yard reset', ['cleanup']),
    make(24, 'Small hardscape detail', ['hardscape']),
    make(25, 'Mulch touch-up', ['beds']),
    make(26, 'Weekly cut', ['maintenance']),
    make(27, 'Leaf cleanup', ['cleanup']),
    make(28, 'Border straightening', ['hardscape']),
    make(29, 'Perennial refresh', ['beds']),
    make(30, 'Route day finish', ['maintenance']),
    make(31, 'Property cleanup', ['cleanup']),
    make(32, 'Edging upgrade', ['hardscape']),
    make(33, 'Bed refresh', ['beds']),
    make(34, 'Clean lines', ['maintenance']),
    make(35, 'Seasonal cleanup', ['cleanup']),
    make(36, 'Stone edging', ['hardscape']),
    make(37, 'New mulch layer', ['beds']),
    make(38, 'Maintenance pass', ['maintenance']),
    make(39, 'Cleanup detail', ['cleanup']),
    make(40, 'Pathway touch-up', ['hardscape']),
    make(41, 'Planting bed', ['beds']),
    make(42, 'Curb appeal cut', ['maintenance']),
    make(43, 'Cleanup sweep', ['cleanup']),
    make(44, 'Border detail', ['hardscape']),
    make(45, 'Garden bed refresh', ['beds']),
    make(46, 'Weekly maintenance detail', ['maintenance']),
    make(47, 'Final cleanup', ['cleanup']),
    make(48, 'Hardscape tidy', ['hardscape']),
    make(49, 'Mulch + edging detail', ['beds']),
    make(50, 'Lines + trim', ['maintenance']),
    make(51, 'Leaves + debris', ['cleanup']),
    make(52, 'Edging / borders', ['hardscape']),
  ];
})();

