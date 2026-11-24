import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
const [hero, sheet, studio] = process.argv.slice(2)
if (!hero || !sheet || !studio) throw new Error('Pass the hero, contact sheet and studio source PNG paths.')
await mkdir('public/media',{recursive:true})
async function save(source,name){
  await Promise.all([[1536,''],[640,'-sm']].map(([width,suffix])=>source.clone().resize({width}).webp({quality:width===640?80:87}).toFile(`public/media/${name}${suffix}.webp`)))
}
await save(sharp(hero),'hero')
const heroInfo=await sharp(hero).metadata()
await save(sharp(hero).extract({
  left:Math.floor(heroInfo.width*.12),
  top:Math.floor(heroInfo.height*.23),
  width:Math.floor(heroInfo.width*.86),
  height:Math.floor(heroInfo.height*.72),
}),'hero-mobile')
const sheetInfo=await sharp(sheet).metadata()
const tileWidth=Math.floor(sheetInfo.width/3),tileHeight=Math.floor(sheetInfo.height/2)
await Promise.all(['gt','sport','electric','detail','cockpit','wheel'].map((name,index)=>save(sharp(sheet).extract({left:index%3*tileWidth,top:Math.floor(index/3)*tileHeight,width:tileWidth,height:tileHeight}),name)))
const {data,info}=await sharp(studio).removeAlpha().raw().toBuffer({resolveWithObject:true})
const colors={silver:[171,175,178],black:[53,56,61],red:[193,45,38],white:[244,241,233],blue:[42,95,166],green:[42,99,74]}
await Promise.all(Object.entries(colors).map(async ([name,tint])=>{
  const pixels=Buffer.from(data)
  for(let index=0;index<pixels.length;index+=3){
    const [r,g,b]=pixels.subarray(index,index+3)
    const weight=Math.min(1,Math.max(0,(Math.min(r,b)-g-5)/25))*Math.min(1,Math.max(0,(r-g-8)/30))
    if(!weight) continue
    const light=r*.24+g*.63+b*.13
    tint.forEach((channel,offset)=>{
      const mapped=light<115 ? light/115*channel : channel+(255-channel)*(light-115)/140
      pixels[index+offset]=Math.round(pixels[index+offset]*(1-weight)+mapped*weight)
    })
  }
  await save(sharp(pixels,{raw:info}),`studio-${name}`)
}))
