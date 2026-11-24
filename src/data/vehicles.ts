export interface Option { id: string; name: string; price: number; color?: string; description?: string }
export interface Hotspot { name:string; x:number; y:number; text:string; spec?:'wheel'|'powertrain' }
export interface Vehicle {
  id: string; slug: string; model: string; category: string; description: string
  price: number; hp: number; torque: number; speed: number; zero: number; weight: number
  powertrain: string; transmission: string; image: string; interior: string; paints: Option[]
  wheels: Option[]; interiors: Option[]; packages: Option[]; hotspots: Hotspot[]
}
export const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}.webp`
export const paints: Option[] = [
  {id:'silver',name:'Titanium Silver',price:0,color:'#a4a8aa'},
  {id:'black',name:'Obsidian Black',price:3500,color:'#303035'},
  {id:'red',name:'Velocity Red',price:5900,color:'#b82f27'},
  {id:'white',name:'Arctic White',price:3500,color:'#efede5'},
  {id:'blue',name:'Racing Blue',price:5400,color:'#285b91'},
  {id:'green',name:'Racing Green',price:5400,color:'#285647'},
]
// Percentages are measured within each exterior photograph, before letterboxing.
const exteriorHotspots: Record<string,Hotspot[]> = {
  hero:[
    {name:'Front headlights',x:50,y:65,text:'Slim LED blades trace the front fenders and leave room for the cooling channels.'},
    {name:'Front splitter',x:33,y:78,text:'The wide carbon lip separates airflow across the nose from the flow beneath the car.'},
    {name:'Wheel and brake assembly',x:65,y:68,text:'The open-spoke wheel exposes the carbon ceramic brake assembly.',spec:'wheel'},
    {name:'Cockpit and windshield',x:54,y:49,text:'A low, raked windshield leads into the compact driver cell.'},
    {name:'Side air intake',x:80,y:60,text:'The sculpted side inlet directs cooling air toward the mid-mounted powertrain.',spec:'powertrain'},
    {name:'Rear aerodynamic wing',x:85,y:47,text:'The raised rear plane manages airflow as it leaves the tail.'},
  ],
  gt:[
    {name:'Front headlights',x:62,y:48,text:'Swept lamp housings follow the curve of the front fenders.'},
    {name:'Front splitter',x:76,y:73,text:'The shallow lip runs beneath the grille and guides air under the nose.'},
    {name:'Wheel and brake assembly',x:49,y:65,text:'The open alloy spokes give a view into the front brake assembly.',spec:'wheel'},
    {name:'Cockpit and windshield',x:49,y:29,text:'The broad windshield and low cowl open the view down the long bonnet.'},
    {name:'Side vent',x:39,y:47,text:'A horizontal outlet sits behind the front wheel arch.'},
  ],
  sport:[
    {name:'Front headlights',x:61,y:51,text:'Twin lighting elements sit inside each compact front housing.'},
    {name:'Front splitter',x:73,y:76,text:'The lower lip runs below the central opening and wraps around the nose.'},
    {name:'Wheel and brake assembly',x:48,y:65,text:'The front alloy wheel sits flush with the widened fender.',spec:'wheel'},
    {name:'Cockpit and windshield',x:51,y:30,text:'The windshield tapers into the roof over the compact driver cell.'},
    {name:'Side air intake',x:25,y:60,text:'The recessed lower opening sits ahead of the rear wheel.'},
    {name:'Rear aerodynamic wing',x:18,y:32,text:'The raised rear wing sits above the short tail.'},
  ],
  electric:[
    {name:'Front headlights',x:86,y:49,text:'The narrow lighting modules sit above the corner ducts.'},
    {name:'Front splitter',x:75,y:75,text:'The low leading edge carries airflow below the front underbody.'},
    {name:'Wheel and brake assembly',x:48,y:65,text:'The large front wheel and open spokes expose the brake assembly.',spec:'wheel'},
    {name:'Cockpit and windshield',x:53,y:33,text:'The curved windshield flows into the roof above the driver cell.'},
    {name:'Front corner duct',x:59,y:59,text:'A vertical opening cuts into the nose below the headlight.'},
  ],
}
const packages: Option[] = [
  {id:'track',name:'Track calibration',price:8500,description:'Circuit-focused damper and stability control calibration.'},
  {id:'carbon',name:'Carbon engineering',price:12500,description:'Lightweight structural and underbody components.'},
  {id:'tour',name:'Touring package',price:6200,description:'Extended cabin insulation and touring suspension calibration.'},
]
export const vehicles: Vehicle[] = [
  {id:'01',slug:'vxr-01',model:'VXR-01',category:'Flagship Hypercar',description:'A mid-engine study in downforce, response and the relationship between driver and machine.',price:825000,hp:1048,torque:960,speed:386,zero:2.4,weight:1420,powertrain:'4.0 L twin-turbo V8 hybrid',transmission:'8-speed dual clutch',image:'hero',paints},
  {id:'02',slug:'vxr-gt',model:'VXR-GT',category:'Grand Tourer',description:'An unhurried cabin wrapped around a powertrain built to cross continents.',price:245000,hp:685,torque:815,speed:328,zero:3.3,weight:1740,powertrain:'5.2 L twin-turbo V12',transmission:'8-speed automatic',image:'gt',paints:[{id:'factory',name:'Graphite Metallic',price:0,color:'#535459'}]},
  {id:'03',slug:'vxr-s',model:'VXR-S',category:'Performance Coupe',description:'A compact chassis tuned for the roads that reward momentum and precision.',price:138000,hp:492,torque:580,speed:294,zero:3.8,weight:1350,powertrain:'3.0 L twin-turbo flat-six',transmission:'6-speed manual',image:'sport',paints:[{id:'factory',name:'Burnt Copper',price:0,color:'#b45129'}]},
  {id:'04',slug:'vxr-e',model:'VXR-E',category:'Electric Performance Concept',description:'Immediate torque and a low-mounted battery reshape the performance coupe.',price:310000,hp:912,torque:1150,speed:315,zero:2.7,weight:1890,powertrain:'Dual-motor electric AWD',transmission:'Single-speed reduction',image:'electric',paints:[{id:'factory',name:'Ceramic White',price:0,color:'#ede8df'}]},
].map(vehicle=>({...vehicle,interior:'cockpit',wheels:[{id:'factory',name:'Factory forged wheels',price:0}], interiors:[{id:'factory',name:'Carbon Black',price:0,color:'#292929'}],packages,hotspots:exteriorHotspots[vehicle.image]}))
export const findVehicle = (slug: string | undefined) => vehicles.find(vehicle=>vehicle.slug===slug)
export const money = (amount: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(amount)
export const paintImage = (vehicle: Vehicle, paintId: string) => media(vehicle.slug==='vxr-01' ? `studio-${paintId}` : vehicle.image)
export const specs = [
  {key:'hp',label:'Power',unit:'hp'}, {key:'torque',label:'Torque',unit:'Nm'},
  {key:'speed',label:'Top speed',unit:'km/h'}, {key:'zero',label:'0–100 km/h',unit:'s'},
  {key:'weight',label:'Weight',unit:'kg'},
] as const
