const asset = (file) =>
  new URL(`../pages/landing-assets/RadiantEducation-Assets/universities/${file}`, import.meta.url).href

export const UNIVERSITIES = [
  { name: 'Chandigarh University', logo: asset('chandigarh.png') },
  { name: 'Amity University', logo: asset('amity.png') },
  { name: 'Sharda University', logo: asset('sharda.png') },
  { name: 'Manipal University', logo: asset('manipal.png') },
  { name: 'Kurukshetra University', logo: asset('kurukshetra.png') },
  { name: 'LPU', logo: asset('lpu.png') },
  { name: 'UPES', logo: asset('upes.png') },
  { name: 'Vivekanand Global University', logo: asset('vgu.png') },
  { name: 'SRM University Sikkim', logo: asset('srm-sikkim.png') },
  { name: 'Sikkim Manipal University', logo: asset('sikkim-manipal.png') },
  { name: 'Amrita University', logo: asset('amrita.png') },
  { name: 'Shoolini University', logo: asset('shoolini.png') },
  { name: 'Andhra University', logo: asset('andhra.png') },
  { name: 'NMIMS', logo: asset('nmims.png') },
  { name: 'DY Patil (Navi Mumbai)', logo: asset('dypatil-navimumbai.png') },
  { name: 'GLA University', logo: asset('gla.png') },
  { name: 'Parul University', logo: asset('parul.png') },
  { name: 'Alliance University', logo: asset('alliance.png') },
  { name: 'Christ University', logo: asset('christ.png') },
  { name: 'Assam Down Town University', logo: asset('assam-downtown.png') },
]
