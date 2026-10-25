import type { PaintingId } from './paintings'

export type ClueKey = 'head' | 'hands' | 'robe'
type Bilingual = { zh: string; en: string }

export const clueReadings = {
  softCap: { title: { zh: '软帽与手眼造型', en: 'Soft cap and hand-shaped eyes' }, meaning: { zh: '原图用两只小手代替眼睛，蓝色软帽与发际另成一层。插画把小手改成比耶和点赞，是当代趣味改编；不能用这些新手势解释原画的历史含义。', en: 'In the source, two small hands take the place of ordinary eyes, below the blue cap and hairline. The illustration turns those hands into a peace sign and thumbs-up as a playful contemporary adaptation; these new gestures do not explain the original image historically.' } },
  peaches: { title: { zh: '托桃与手势', en: 'Peaches and gestures' }, meaning: { zh: "圆润的桃形持物与抬起的手一起引导视线，颜色、形状和位置是观察的起点。", en: "The rounded peach-shaped objects and raised hand guide the eye through colour, shape and placement." } },
  goldCrown: { title: { zh: '额冠与火焰纹', en: 'Crown and flames' }, meaning: { zh: "额前冠饰与头后的火焰分成两层，先看轮廓，再比较它们的位置与颜色。", en: "The brow crown and flames behind it form two layers. Compare their outlines, positions and colours." } },
  hornedCrown: { title: { zh: '角形冠饰', en: 'Horn-like headpiece' }, meaning: { zh: "上翘的角形装饰向两侧展开，让头部轮廓更加醒目。", en: "Upward-curving ornaments spread to either side and accentuate the silhouette." } },
  officialCap: { title: { zh: '官帽式冠帽', en: 'Official-style cap' }, meaning: { zh: "方顶、侧翼和冠板构成清楚的几何轮廓，与面部和发束形成对比。", en: "The square top, side flaps and front panel create geometric outlines that contrast with the face and hair." } },
  ornateCap: { title: { zh: '纹饰冠帽', en: 'Patterned headpiece' }, meaning: { zh: "点纹、花饰和卷起的边缘把视线引向头部。对比这些小装饰，能发现不同角色的造型差异。", en: "Dots, floral motifs and curling edges draw the eye to the head. Comparing them reveals differences between the figures." } },
  plume: { title: { zh: '羽饰与发束', en: 'Plume and hair crest' }, meaning: { zh: "高起的羽状装饰与发束向上伸展，与周围曲线呼应。观察时可以依次分辨发、冠和背景。", en: "Tall plume-like forms and hair extend upward, echoing nearby curves. Distinguish the hair, headwear and background in turn." } },
  chain: { title: { zh: '链索', en: 'Chain' }, meaning: { zh: "链索由重复的节扣连接，弯曲的走向把视线从手部带向身体另一侧。", en: "Repeating links form a curving chain that leads the eye from the hand across the body." } },
  longWeapon: { title: { zh: '长柄兵器', en: 'Long-handled weapon' }, meaning: { zh: "长柄器物延伸出人物身体，形成明显的竖线或斜线。顺着长柄，可以找到握持它的手。", en: "A long shaft extends beyond the body as a vertical or diagonal line. Follow it to locate the hand holding it." } },
  blade: { title: { zh: '剑与刀', en: 'Sword or blade' }, meaning: { zh: "细长的刃身与衣袖形成方向上的对比，握柄的位置帮助我们看清人物的动作。", en: "The long blade contrasts with the direction of the sleeves; the grip clarifies the figure\u2019s action." } },
  gesture: { title: { zh: '手势', en: 'Hand gesture' }, meaning: { zh: "屈指、立掌和握持让手部动作各不相同。沿手指和手臂的方向观察，能看清动作与持物的关系。", en: "Bent fingers, raised palms and grips create distinct gestures. Follow the fingers and arms to see how the hands relate to held objects." } },
  axe: { title: { zh: '斧形器与手势', en: 'Axe-like object and gesture' }, meaning: { zh: "斧形持物与另一只手的屈指动作形成对照。观察柄与刃的连接，再看手指如何握住器物。", en: "The axe-like object contrasts with the other hand\u2019s shaped fingers. Look at the handle and blade, then at the grip." } },
  roundObjects: { title: { zh: '圆形器物与多臂', en: 'Round objects and multiple arms' }, meaning: { zh: "圆形持物分布在举起的手掌上，多条手臂把画面的视线引向不同方向。", en: "Round objects rest on raised palms, while multiple arms lead the eye in different directions." } },
  wheel: { title: { zh: '轮形法器', en: 'Wheel-shaped implement' }, meaning: { zh: "轮形器物的辐条从中心向外展开，圆形轮廓与旁边的直线器物形成对比。", en: "Spokes radiate from the centre of the wheel-shaped object, contrasting with nearby straight implements." } },
  tray: { title: { zh: '托盘与小人形', en: 'Tray and small figure' }, meaning: { zh: "托盘上的小人形形成画中有画的层次，托举的手势把视线引向这一细节。", en: "The small figure on the tray creates an image within the image; the supporting hand draws attention to it." } },
  armour: { title: { zh: '层叠甲衣', en: 'Layered armour' }, meaning: { zh: "护肩、甲片和束带相互叠压。顺着衣缘观察，可以辨认红、绿、蓝各层之间的关系。", en: "Shoulder guards, armour plates and belts overlap. Follow their edges to distinguish the red, green and blue layers." } },
  robe: { title: { zh: '袍服与宽袖', en: 'Robe and broad sleeves' }, meaning: { zh: "宽袖、纹样和层叠衣缘构成袍服的层次，沿着衣褶可以看出布料的转折与垂落。", en: "Broad sleeves, patterns and layered borders structure the robe. Follow folds to see where the fabric turns and falls." } },
  ribbons: { title: { zh: '甲衣与飘带', en: 'Armour and ribbons' }, meaning: { zh: "飘带与衣缘的曲线相互呼应，让静止的人物呈现动势。比较飘带的走向，可以看清它们如何穿过身体周围。", en: "Curving ribbons echo garment edges and suggest movement. Trace their paths around the body." } },
} as const

export type Motif = keyof typeof clueReadings
export type PaintingClue = { observed: Bilingual; motif: Motif }
const clue = (zh: string, en: string, motif: Motif): PaintingClue => ({ observed: { zh, en }, motif })

export const paintingClues: Record<PaintingId, Record<ClueKey, PaintingClue>> = {
  '438': {
    head: clue('三张面孔各戴金色宝冠，中央面孔正视，两侧分别朝向左右，背后有圆形光轮。', 'Three visible faces wear golden crowns, with a frontal face and two profiles against a circular halo.', 'ornateCap'),
    hands: clue('上方双手分别托起金色与浅蓝圆盘，其余手臂持铃、印、弓等物件。', 'The upper hands hold gold and pale-blue discs; the other arms carry a bell, seal, bow and other objects.', 'roundObjects'),
    robe: clue('朱红袍服围绕盘坐姿态，蓝色飘带从肩侧绕出，白色衣带垂向莲座。', 'Cinnabar robes frame the seated pose, blue ribbons flow from the shoulders, and cream sashes descend towards the lotus seat.', 'robe'),
  },
  '9549': {
    head: clue('蓝色软帽下留着长须，两只小手代替眼睛；卡通版保留手代眼的造型，改作比耶和点赞，并换成蓝灰软巾。', 'The original has a blue cap, a long beard and two hands in place of eyes. The cartoon preserves the hand-shaped eyes as a peace sign and thumbs-up, with a blue-grey headwrap.', 'softCap'),
    hands: clue('一只手在胸前抬起，另一只手在腰侧托着粉红与淡黄色的桃形持物。', 'One hand is raised at the chest; the other holds pink and pale-yellow peach-shaped objects near the waist.', 'peaches'),
    robe: clue('宽大的蓝袍包围坐姿，乳白领缘、橙黄内层和腰间圆形饰物形成对比。', 'The broad blue robe frames a seated pose, contrasting with cream lapels, orange-yellow inner layers and a round belt ornament.', 'robe'),
  },
  '5683': {
    head: clue('额前是金色方冠；黑红火焰另画在头后，并非整顶冠都在燃烧。', 'A square gold crown sits on the brow; the black-and-red flames are painted behind the head, not as the crown itself.', 'goldCrown'),
    hands: clue('右手提着一段有方形节扣的链索，另一只手握在腰侧。', 'One hand lifts a chain with rectangular links; the other is clenched by the waist.', 'chain'),
    robe: clue('黑底白色卷纹的护肩压在红蓝甲片上，绿色长带从肩部绕下。', 'Black shoulder guards with white curls sit over red-and-blue armour, with green ribbons circling down.', 'ribbons'),
  },
  '5685': {
    head: clue('深蓝色冠面布满白色点纹，两侧伸出向上卷曲的尖饰。', 'White dots cover the dark-blue headpiece, with two pointed ornaments curling upward.', 'hornedCrown'),
    hands: clue('双手在身前握着一件细长的兵器，尖端高过肩头。', 'Both hands grip a slim, long weapon whose point rises above the shoulder.', 'longWeapon'),
    robe: clue('赤红宽袖罩住绿色内层，腰下露出黄底纹样和层叠甲片。', 'Broad red sleeves cover a green inner layer, while patterned yellow fabric and armour appear below.', 'robe'),
  },
  '5686': {
    head: clue('黑色圆顶冠布满点纹，边缘伸出细长卷饰，前方还有红色纹带。', 'The round black cap is dotted, with thin curling ornaments at the sides and a red band at the front.', 'ornateCap'),
    hands: clue('双手靠近腰带和衣襟；画中没有清晰可辨的刀剑或长杆。', 'The hands rest near the belt and robe; no sword or long staff is clearly visible.', 'gesture'),
    robe: clue('黑底小卷纹上衣配浅绿色领肩，蓝、绿、红三层衣摆在腰下交叠。', 'A black robe of tiny curls meets a pale-green collar, with blue, green and red layers below the waist.', 'robe'),
  },
  '5687': {
    head: clue('黑红冠上两道角形饰向上翻卷，与深色发髻连成高高的轮廓。', 'Two horn-like ornaments curl up from the dark-red crown and merge with the tall hair silhouette.', 'hornedCrown'),
    hands: clue('一侧竖着带红缨的长杆，另一只手握住身前的短柄器物。', 'A long shaft with a red tassel rises at one side; the other hand holds a shorter object in front.', 'longWeapon'),
    robe: clue('赤红外袍、绿甲和白底花纹护片层叠，腰间收以窄带。', 'A red outer robe, green armour and white patterned guards overlap beneath a narrow belt.', 'armour'),
  },
  '5688': {
    head: clue('蓝色面容上方是一顶缀花的小冠，耳旁两束赤色羽状发饰向上展开。', 'A small flowered crown sits above the blue face, while two red plume-like tufts rise beside the ears.', 'plume'),
    hands: clue('双手交叠在胸腹间，宽袖与飘带挡住了部分持物细节。', 'The hands meet near the chest and waist, partly obscured by broad sleeves and ribbons.', 'gesture'),
    robe: clue('青绿宽袖与红色甲片交错，黄色束带垂在裙甲前。', 'Wide blue-green sleeves cross red armour plates, and yellow ties hang over the skirt armour.', 'ribbons'),
  },
  '5689': {
    head: clue('深蓝点纹圆帽中央缀花，帽缘向左右轻轻上翘。', 'A flower marks the centre of the dotted dark-blue cap, whose edges turn up slightly.', 'ornateCap'),
    hands: clue('手臂垂向腰侧，持物并未像邻近几张画那样突出。', 'The arms drop toward the waist; any held object is less prominent than in nearby images.', 'gesture'),
    robe: clue('黑底白卷纹的袍身与绿腰带形成对比，腿部仍露出彩色护甲。', 'White curls on a black robe contrast with a green belt, while coloured leg guards remain visible.', 'robe'),
  },
  '5690': {
    head: clue('头发高高向两侧竖起，发顶只扣着一顶小型黑金冠。', 'Hair rises high on both sides, with only a small black-and-gold cap at the top.', 'plume'),
    hands: clue('一手在面旁屈指作势，另一手提着短柄的斧形器物。', 'One hand shapes a gesture beside the face; the other carries a short-handled axe-like object.', 'axe'),
    robe: clue('红色小花纹宽袍罩着绿领和蓝色下摆，袖口画得特别宽。', 'A broad red robe of tiny floral motifs covers a green collar and blue lower layers, with especially wide cuffs.', 'robe'),
  },
  '5691': {
    head: clue('蓝色面容两侧是高耸的红色发束，头顶又伸出两道黑红卷角；它更像发与角饰的组合。', 'Tall red hair flanks the blue face, while two black-and-red curls rise above it: a combination of hair and horn-like ornament.', 'hornedCrown'),
    hands: clue('上方两手分别托起浅绿与深红圆器，另一手握竖直长杆，形成多臂形象。', 'Two raised hands hold pale-green and dark-red round objects; another grips a vertical staff, creating a multi-armed figure.', 'roundObjects'),
    robe: clue('绿鳞片式腰甲、红色绶带和紫色下裳覆盖蓝色身体。', 'Green scale-like waist armour, red ribbons and a purple skirt layer over the blue body.', 'armour'),
  },
  '5692': {
    head: clue('黑色高冠前有浅金色额片，顶部两侧各有短小的卷饰。', 'A pale-gold front panel marks the tall black cap, with short curling ornaments at its upper sides.', 'officialCap'),
    hands: clue('双手在胸前握住竖起的长剑，剑尖指向画面右上。', 'Both hands grip a raised long sword before the chest, its point aimed toward the upper right.', 'blade'),
    robe: clue('蓝袍是画面的最大色块，外罩红绿护肩与绕身长带。', 'The blue robe is the largest colour field, crossed by red-green shoulder guards and long ribbons.', 'ribbons'),
  },
  '5693': {
    head: clue('暗红冠体紧贴黑发，顶部两侧有向外翻起的角状饰件。', 'A dark-red crown hugs the black hair, with horn-like pieces curling outward on either side.', 'hornedCrown'),
    hands: clue('人物把一柄细长兵器横握在胸前，尖端伸向画面右侧。', 'The figure holds a slim long weapon across the chest, its point extending to the right.', 'blade'),
    robe: clue('浅绿甲片护住腰腿，黑底卷纹护肩衬出赤红衣袖。', 'Pale-green armour protects the waist and legs; black curled shoulder guards frame red sleeves.', 'armour'),
  },
  '5694': {
    head: clue('深蓝点纹帽向两侧伸出扁平帽翼，中央还有一段直立装饰。', 'Flat side flaps extend from the dotted blue cap, with a short upright ornament at the centre.', 'officialCap'),
    hands: clue('一手抬到面颊附近，另一手握着斜穿腰际的长刃。', 'One hand rises near the cheek while the other holds a long blade diagonally across the waist.', 'blade'),
    robe: clue('红袖和绿护肩包住上身，白底花纹甲裙下垂到腿前。', 'Red sleeves and green shoulder guards frame a white patterned armour skirt hanging over the legs.', 'armour'),
  },
  '5695': {
    head: clue('深色高冠上有两个向外卷起的红色角饰，冠前画出细竖线。', 'Two red horn-like curls rise from the tall dark crown, whose front is marked by fine vertical lines.', 'hornedCrown'),
    hands: clue('一手在胸口屈指作势，另一手靠近腰带；器物局部被衣饰遮住。', 'One hand shapes a gesture at the chest while the other stays near the belt; clothing hides part of any object.', 'gesture'),
    robe: clue('绿色袍身外露出花纹护肩与层叠裙甲，细长衣带从腰间垂落。', 'A green robe is edged by patterned shoulder guards and layered skirt armour, with narrow ties hanging from the waist.', 'ribbons'),
  },
  '5696 2': {
    head: clue('黑发高起，两道弯角伸进黄云；额前只露出小块深蓝色冠饰。', 'Tall black hair and two curved ornaments reach into the yellow clouds, while only a small dark-blue crest shows at the brow.', 'hornedCrown'),
    hands: clue('一手高举八辐轮形器，另一手直握长剑，两件器物并排出现。', 'One hand raises an eight-spoked wheel; the other holds an upright sword beside it.', 'wheel'),
    robe: clue('黑底白卷纹披肩、蓝色胸甲和赤红下裳形成三层鲜明对比。', 'A black-and-white curled cape, blue chest armour and red lower robe make three contrasting layers.', 'armour'),
  },
  '5697 2': {
    head: clue('黑色高冠的前面画出白色分格，两侧红色卷角向上伸出。', 'White lines divide the front of the tall black cap, while red curls rise at both sides.', 'officialCap'),
    hands: clue('双手握住竖起的分节长杆，杆顶连着向上翻卷的火焰形纹。', 'Both hands grip a segmented upright staff topped by a curling flame-shaped form.', 'longWeapon'),
    robe: clue('赤红外袖与蓝色下裳交叠，绿色长带绕过腰和腿。', 'Red outer sleeves overlap a blue lower robe as long green ribbons circle the waist and legs.', 'ribbons'),
  },
  '5698': {
    head: clue('头顶是短小的红色羽束和花饰，冠饰低矮，面容也比许多同组人物平静。', 'A short red plume and floral ornament sit low on the head; the face is calmer than many others in the group.', 'plume'),
    hands: clue('一手托起盘上的浅色小人形，另一手握着竖立的长柄。', 'One hand presents a small pale figure on a tray; the other grips an upright shaft.', 'tray'),
    robe: clue('红蓝锦纹上衣接着层叠绿裙，长衣带在身体两侧翻卷。', 'Red-and-blue patterned sleeves meet layered green skirts, with long ribbons curling at each side.', 'robe'),
  },
  '5699': {
    head: clue('直边黑冠前面有白色线条，冠外另伸出两束红黑卷角。', 'White lines mark the front of the straight-edged black cap, with two red-black curls rising outside it.', 'officialCap'),
    hands: clue('一手握分节长杆，另一手在胸前展开；杆上方还有火焰形纹。', 'One hand grips a segmented staff and the other opens at the chest; a flame-like form rises above the staff.', 'longWeapon'),
    robe: clue('红袖、蓝下裳和绿飘带分成清楚的三层，脚下露出云头靴。', 'Red sleeves, a blue lower robe and green ribbons form clear layers above cloud-toed boots.', 'ribbons'),
  },
  '5702': {
    head: clue('主像戴方顶黑帽，以白线勾出冠板；左侧还画有一位红羽帽人物。', 'The main figure wears a square black cap outlined in white; a second figure in a red-plumed cap appears at the left.', 'officialCap'),
    hands: clue('主像一手立掌，身旁长杆带红穗；前景人物也向他伸出双手。', 'The main figure raises a palm beside a red-tasselled staff, while the foreground companion extends both hands toward him.', 'gesture'),
    robe: clue('主像的蓝红宽袖与绿下装，对照前景人物的红色纹甲。', 'The main figure’s blue-red sleeves and green lower robe contrast with the foreground companion’s red patterned armour.', 'robe'),
  },
  '5703': {
    head: clue('头顶是一圈较窄的冠饰，两条红黑角饰从两侧向外弯曲。', 'A narrow band crowns the head, with two red-black horn-like ornaments curving outward.', 'hornedCrown'),
    hands: clue('一手横握长剑，另一手举在胸前，手指屈成固定姿势。', 'One hand holds a long sword across the body; the other raises shaped fingers before the chest.', 'blade'),
    robe: clue('蓝色大袖、绿色胸甲和红色边饰层层叠在腰前。', 'Broad blue sleeves, green chest armour and red borders overlap at the waist.', 'armour'),
  },
  '5704': {
    head: clue('红色高束羽饰从冠顶翻卷，耳旁两块蓝红护耳格外突出。', 'A tall red plume sweeps back from the crown, with blue-red ear guards projecting on both sides.', 'plume'),
    hands: clue('双手握住红色长杆，杆顶在头后接上一大片火焰形纹。', 'Both hands grip a red shaft whose top meets a large flame-shaped form behind the head.', 'longWeapon'),
    robe: clue('红蓝细纹甲片覆在浅绿披肩下，黄色束带在腰际打结。', 'Fine red-blue armour patterns sit beneath a pale-green cape, with yellow ties knotted at the waist.', 'armour'),
  },
  '5705': {
    head: clue('深蓝点纹帽顶部伸出两条卷角；后面的火焰纹与帽上的卷角分处不同层次。', 'Two curls rise from the dotted blue cap; the flames behind it form a separate layer from the curls on the cap.', 'ornateCap'),
    hands: clue('一手握着有连续白色分节的长杆，另一手在胸前屈指。', 'One hand grips a long staff with repeated white segments; the other forms a gesture at the chest.', 'longWeapon'),
    robe: clue('绿袖与蓝护肩包住胸部，黄裙外还有弯曲飘带。', 'Green sleeves and blue shoulder guards frame the chest, while curved ribbons cross a yellow lower robe.', 'ribbons'),
  },
}
