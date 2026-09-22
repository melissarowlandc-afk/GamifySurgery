# Gray Overshirt v2 generation prompts

Mode: built-in image generation. Original character sheet was the identity/style reference; original head pixels were retained separately by the importer.

Final import sources: `upper-parts-generated-v2.png` for sleeves and forearms/hands; `upper-parts-generated-v3.png` for arm-free torsos. The importer packs these into the fixed `upper-v2.png` atlas; raw generated dimensions are not the atlas contract.

## Initial separated parts

Use case: identity-preserve
Asset type: standardized 2D game character cutout parts atlas, transparent PNG.
Reference image: original Gray Overshirt character sheet. Preserve exactly his gray rolled-sleeve overshirt, cream undershirt, warm tan skin, black wristwatch, pixel-art outlines, colors and shading. This is a parts sheet, NOT posed whole characters.
Create exactly 4 equally spaced columns and 5 equally spaced rows on a 1024 wide by 1280 tall TRANSPARENT canvas. Each invisible cell is 256x256. No text, labels, grid, checkerboard, shadows or background. All pieces separate centered within their own cell with generous transparent margins, never touching another cell.
Columns from left to right: SOUTH front view, EAST facing right profile, WEST facing left profile, NORTH back view. These view columns NEVER change.
Rows:
1: arm-free torso only, from shirt collar to shirt hem, no head, no skin neck, no arms or hands or legs. Complete gray fabric at shoulders, cream tee visible front, correct narrow side silhouette profile, full gray shirt back north. No black empty armholes.
2: anatomical LEFT upper arm sleeve only, rounded shoulder cap down through rolled cuff at elbow, no forearm or hand.
3: anatomical RIGHT upper arm sleeve only, rounded shoulder cap down through rolled cuff at elbow, no forearm or hand.
4: anatomical LEFT forearm and relaxed hand only, skin elbow down to wrist and fingers. BLACK WRISTWATCH on all four LEFT forearms.
5: anatomical RIGHT forearm and relaxed hand only, skin elbow down to wrist and fingers. NO WATCH on any RIGHT forearm.
ANATOMY: anatomical left/right are character's own body side, never positions on image. All upper arm and forearm bone axes point vertically DOWN in neutral resting posture; no bent L-shape arms. Parts are straight relaxed natural anatomy, elbow at top and wrist below. Upper sleeves consistent length and width, forearms consistent length/skin tone. Rounded underlap at elbow for seamless rigging.
SOUTH: anatomical left is screen-right body side, thumb is on inward/left side of that hand; anatomical right thumb inward/right. Show front-view appropriate palm/side surface.
EAST: person faces screen-right. Both forearm hand thumbs point FORWARD toward screen-right, pinky edge toward screen-left. Left arm is far side with watch, right arm near side bare; surface artwork needs correct matching arm side.
WEST: person faces screen-left. Both forearm hand thumbs point FORWARD toward screen-left, pinky edge toward screen-right. Left arm is near side with watch, right arm far side bare.
NORTH: backs of hands visible, anatomical left belongs screen-left, right screen-right, thumbs toward body.
No invented accessories. No hands attached to sleeves in rows2/3. No sleeve fragments attached to forearm tops in rows4/5 except narrow skin joint underlap. Do NOT include heads or full characters. Preserve original crisp pixel-art drawing style, not smooth cartoon repaint.

## Remove residual torso sleeves

Edit only the TOP ROW of this transparent character parts atlas. Preserve all lower four rows pixel-for-pixel, same positions, arms and hands unchanged. On the four top-row shirts, completely REMOVE BOTH SLEEVES AND ARMS including upper shoulder caps and rolled cuffs: leave only the central sleeveless torso garment, filled gray fabric shoulder sockets, collar and body of overshirt. The torso should look like a sleeveless vest with clean closed fabric side boundaries, NOT black hollow armholes, NOT a complete shirt with sleeves. In profile remove the entire big gray upper arm oval plus cuff, revealing continuous shirt side fabric underneath. No arms, no sleeves, no cuffs anywhere in TOP ROW. Preserve front cream tee/buttons/pocket, profile silhouette, back seams, colors and pixel art. Keep exact canvas size, transparent background, 4 columns5rows all placement unchanged. Do not change any of the separate sleeves, forearms, hands, or wristwatches in rows2-5.

## Remove profile shoulder outlines

Edit ONLY the top-row EAST and WEST sleeveless torso parts (columns2 and3). Remove the oval shoulder/armhole outlines on the side of these two torsos. Replace those oval shapes with uninterrupted plain gray overshirt fabric, matching adjacent shading and texture. No black hole, no oval seam, no drawn shoulder, no sleeve. The whole torso side must be continuous smooth gray fabric so a separate arm can be animated over it without a ghost armhole being revealed. Keep collar, buttons, pocket, hem and outer silhouette unchanged. Leave ALL other parts and rows untouched, same exact positions, pixel-art style and canvas size1122x1402. Preserve transparency. This is a precise tiny cleanup, no redraw of hands, sleeves, watches, front torso or back torso.
