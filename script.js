let siswa=[
"Agha Muhammad Azam Ar-Rosyid",
"Aldiansah Arga Pratama",
"Fahad Ahmad Alamudi",
"Intan Nirmalasari Salabila Roskiani",
"Mohammad Farid Syaifulloh",
"Mohammad Musyafa Akbar",
"Muhammad Irfan Arisaputra Islahudin",
"Muhammad Michael Al-Muhith",
"Naila Rheisy Admaja Veaka",
"Salma Larissa Indrasari"
];

let jadwalPelajaran={
Senin:["Geografi","Matematika","B Indo","Seni","Biologi"],
Selasa:["B Jawa","Sejarah","Kemuh","Informatika","Geografi","Ekonomi"],
Rabu:["Penjaskes","Arab","PAI","Ekonomi"],
Kamis:["Biologi","B Indo","PAI","B Inggris","Sosiologi"],
Jumat:["PPKN","BK","Matematika","Sosiologi"]
};

let jadwalPiket={
Senin:["Azam","Salma"],
Selasa:["Farid","Musyafa"],
Rabu:["Michael","Intan"],
Kamis:["Fahad","Rheisy"],
Jumat:["Arga","Irfan"]
};

let tugas=JSON.parse(localStorage.getItem("tugas"))||[];
let absensi=JSON.parse(localStorage.getItem("absensi"))||{};

let motivasi=["Semangat 🌸","Kamu hebat 💜","Jangan menyerah ✨"];

let adminUser="admineleventwolighthouse";
let adminPass="112rumahbercahaya";
let siswaPass="siswaeleventwolighthouse";

let isAdmin=false;

function login(){
let u=username.value.toLowerCase().trim();
let p=password.value.toLowerCase().trim();

if(u===adminUser && p===adminPass){
isAdmin=true;openApp();return;
}

for(let s of siswa){
if(s.toLowerCase()===u && p===siswaPass){
isAdmin=false;openApp();return;
}
}
loginMsg.innerText="Login salah";
}

function openApp(){
loginSection.style.display="none";
appSection.style.display="block";
initApp();
}

function logout(){location.reload();}

function initApp(){
renderSiswa();renderAbsensi();renderTugas();renderJadwal();motivasiRandom();grafik();
}

function showTab(id,e){
document.querySelectorAll(".tabContent").forEach(t=>t.style.display="none");
document.getElementById(id).style.display="block";
document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"));
e.classList.add("active");
}

function renderSiswa(){
daftarSiswa.innerHTML="";
siswa.forEach(s=>daftarSiswa.innerHTML+=`<li>${s}</li>`);
}

function searchSiswa(){
let q=searchSiswa.value.toLowerCase();
document.querySelectorAll("#daftarSiswa li").forEach(li=>{
li.style.display=li.innerText.toLowerCase().includes(q)?"":"none";
});
}

function renderAbsensi(){
absensiList.innerHTML="";
let t=new Date().toISOString().slice(0,10);
siswa.forEach(s=>{
let v=absensi[t]?.[s]||"";
absensiList.innerHTML+=`${s}
<select ${!isAdmin?"disabled":""} onchange="updateAbsensi('${s}',this.value)">
<option></option>
<option ${v=="Hadir"?"selected":""}>Hadir</option>
<option ${v=="Izin"?"selected":""}>Izin</option>
<option ${v=="Sakit"?"selected":""}>Sakit</option>
<option ${v=="Alpha"?"selected":""}>Alpha</option>
</select><br>`;
});
}

function updateAbsensi(s,v){
if(!isAdmin)return;
let t=new Date().toISOString().slice(0,10);
if(!absensi[t])absensi[t]={};
absensi[t][s]=v;
localStorage.setItem("absensi",JSON.stringify(absensi));
grafik();
}

function tambahTugas(){
if(!isAdmin)return alert("Admin saja");
let n=prompt("Nama tugas");let d=prompt("Deadline");
if(n&&d){tugas.push({nama:n,deadline:d,done:false});renderTugas();}
}

function renderTugas(){
listTugas.innerHTML="";
tugas.forEach((t,i)=>{
listTugas.innerHTML+=`${t.nama} (${t.deadline})
<input type="checkbox" ${t.done?"checked":""} onchange="toggleTugas(${i})"><br>`;
});
localStorage.setItem("tugas",JSON.stringify(tugas));
}

function toggleTugas(i){tugas[i].done=!tugas[i].done;renderTugas();}

function renderJadwal(){
jadwalList.innerHTML="";
for(let h in jadwalPelajaran){
jadwalList.innerHTML+=`<div class="jadwalItem"><b>${h}</b><br>
${jadwalPelajaran[h].join(", ")}<br>
Piket: ${jadwalPiket[h].join(", ")}</div>`;
}
}

function motivasiRandom(){
motivasiText.innerText=motivasi[Math.floor(Math.random()*motivasi.length)];
}

function rekapAbsensi(){
let r="";
for(let t in absensi){
r+=t+"\n";
for(let s in absensi[t])r+=s+" : "+absensi[t][s]+"\n";
}
alert(r||"Kosong");
}

function exportExcel(){
let csv="Tanggal,Nama,Status\n";
for(let t in absensi){
for(let s in absensi[t])csv+=`${t},${s},${absensi[t][s]}\n`;
}
let b=new Blob([csv]);let a=document.createElement("a");
a.href=URL.createObjectURL(b);a.download="absensi.csv";a.click();
}

function grafik(){
let h=0,i=0,s=0,a=0;
let t=new Date().toISOString().slice(0,10);
if(absensi[t]){
for(let x in absensi[t]){
if(absensi[t][x]=="Hadir")h++;
if(absensi[t][x]=="Izin")i++;
if(absensi[t][x]=="Sakit")s++;
if(absensi[t][x]=="Alpha")a++;
}
}
let c=grafik.getContext("2d");
c.clearRect(0,0,300,150);
c.fillText(`H:${h} I:${i} S:${s} A:${a}`,10,15);
c.fillRect(10,30,h*20,10);
c.fillRect(10,50,i*20,10);
c.fillRect(10,70,s*20,10);
c.fillRect(10,90,a*20,10);
}

function searchOption(){
let q=searchOption.value.toLowerCase();
document.querySelectorAll(".tabBtn").forEach(b=>{
b.style.display=b.innerText.toLowerCase().includes(q)?"":"none";
});
}

window.onload=()=>setTimeout(()=>splash.style.display="none",1200);
