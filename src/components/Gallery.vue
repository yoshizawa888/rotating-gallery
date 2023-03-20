<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, sRGBEncoding, TextureLoader, MeshBasicMaterial, Mesh, Raycaster, Vector2, BufferGeometry, BufferAttribute, Points, ShaderMaterial } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from '../assets/shaders/shader.vert?raw';
import fragmentShader from '../assets/shaders/shader.frag?raw';

import cardBack from '../assets/img/ball.jpg';
import bakuhun from '../assets/img/bakuhun.jpg';
import bashamo from '../assets/img/bashamo.jpg';
import bikuthini from '../assets/img/bikuthini.jpg';
import buban from '../assets/img/buban.jpg';
import busutar from '../assets/img/busutar.jpg';
import enbuo from '../assets/img/enbuo.jpg';
import entei from '../assets/img/entei.jpg';
import esuban from '../assets/img/esuban.jpg';
import goukazaru from '../assets/img/goukazaru.jpg';
import hitomu from '../assets/img/hitomu.jpg';
import houou from '../assets/img/houou.jpg';
import kosuta from '../assets/img/kosuta.jpg';
import kyukon from '../assets/img/kyukon.jpg';
import raudobon from '../assets/img/raudobon.jpg';
import resiramu from '../assets/img/resiramu.jpg';
import rizadon from '../assets/img/rizadon.jpg';
import shandera from '../assets/img/shandera.jpg';
import soubureizu from '../assets/img/soubureizu.jpg';
import urugamosu from '../assets/img/urugamosu.jpg';
import windiy from '../assets/img/windiy.jpg';

const canvas = ref<HTMLDivElement>();

let w = innerWidth;
let h = innerHeight;
const range = 650;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setPixelRatio(devicePixelRatio);

const camera = new PerspectiveCamera(75, w / h, 1, 10000);
camera.position.set(0, 0, range);

const scene = new Scene();
renderer.outputEncoding = sRGBEncoding;

// レイキャストを作成
const raycaster = new Raycaster();

let flReset = 0;
let reverseFl = 0;
let imgReverseFl = false;
let foucusNum = -1;

// マウスとの交差を調べたいものは配列に格納する
const meshList: Array<Array<Mesh>> | any = [];
let intersects: any;

const cardArray = [bakuhun, bashamo, bikuthini, buban, busutar, enbuo, entei, esuban, goukazaru, hitomu, houou, kosuta, kyukon, raudobon, resiramu, rizadon, shandera, soubureizu, urugamosu, windiy];

let mesh: Mesh[] = [];
const loadPic = new TextureLoader();
const createCerd = (i: number, y: number) => {
	const material: MeshBasicMaterial[] = [
		new MeshBasicMaterial({
			map: loadPic.load(cardArray[i]),
		}),
		new MeshBasicMaterial({
			map: loadPic.load(cardBack),
		}),
		new MeshBasicMaterial({ color: 0xf }),
		new MeshBasicMaterial({ color: 0xf }),
		new MeshBasicMaterial({ color: 0xf }),
		new MeshBasicMaterial({ color: 0xf }),
	];
	const geometry = new BoxGeometry(1, 100, 100);
	mesh[i] = new Mesh(geometry, material);
	scene.add(mesh[i]);
	meshList.push(mesh[i]);
};
for (let i = 0; i < 20; i++) {
	if (i < 10) {
		createCerd(i, 30);
	} else {
		createCerd(i, 200);
	}
}

const particleCount = 300;
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
	positions[i * 3] = Math.random() * range * 2 - (range * 2) / 2;
	positions[i * 3 + 1] = Math.random() * range * 2 - (range * 2) / 2;
	positions[i * 3 + 2] = Math.random() * range * 2 - (range * 2) / 2;
	sizes[i] = 2.5;
}

const particleGeometry = new BufferGeometry();
particleGeometry.setAttribute('position', new BufferAttribute(positions, 3));
particleGeometry.setAttribute('size', new BufferAttribute(sizes, 1));

const particleMaterial = new ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
	uniforms: {
		uResolution: { value: new Vector2(w, h) },
	},
});

const particlMesh = new Points(particleGeometry, particleMaterial);
scene.add(particlMesh);

let mouse = new Vector2(-1, -1);
const handleMouseMove = (event: MouseEvent): void => {
	const element = event.currentTarget as HTMLCanvasElement;
	// canvas要素上のXY座標
	const x = event.clientX - element.offsetLeft;
	const y = event.clientY - element.offsetTop;
	// canvas要素の幅・高さ
	const w = element.offsetWidth;
	const h = element.offsetHeight;

	// -1〜+1の範囲で現在のマウス座標を登録する
	mouse.x = (x / w) * 2 - 1;
	mouse.y = -(y / h) * 2 + 1;

	setTimeout(() => {
		mouse = new Vector2(-1, -1);
	}, 10);
};

// const setControll = () => {
//   const orbitControls = new OrbitControls(camera, renderer.domElement);
//   document.addEventListener(
//     "touchmove",
//     function (e) {
//       e.preventDefault();
//     },
//     { passive: false }
//   );
//   orbitControls.enableDamping = true;
//   orbitControls.dampingFactor = 0.5;
// };

const cardRender = (i: number, y: number, deg: number) => {
	const radian = ((deg + i) / 10) * Math.PI * 2;
	if (i !== foucusNum) {
		mesh[i].position.x = 200 * Math.cos(radian);
		mesh[i].position.y = y;
		mesh[i].position.z = 200 * Math.sin(radian);
		mesh[i].rotation.y = (-Math.PI / 5) * (deg + i);
	} else if (i == foucusNum) {
		if (!imgReverseFl) {
			mesh[i].position.x += (0 - mesh[i].position.x) * 0.2;
			mesh[i].position.y += (0 - mesh[i].position.y) * 0.2;
			mesh[i].position.z += (400 - mesh[i].position.z) * 0.2;
			if (mesh[i].rotation.y <= (-Math.PI / 2) * 2.5) {
				mesh[i].rotation.y += ((-Math.PI / 2) * 5 - mesh[i].rotation.y) * 0.2;
			} else {
				mesh[i].rotation.y += (-Math.PI / 2 - mesh[i].rotation.y) * 0.2;
			}
		} else {
			mesh[i].position.x += (200 * Math.cos(radian) - mesh[i].position.x) * 0.2;
			mesh[i].position.y += (y - mesh[i].position.y) * 0.2;
			mesh[i].position.z += (200 * Math.sin(radian) - mesh[i].position.z) * 0.2;
			mesh[i].rotation.y += ((-Math.PI / 5) * (deg + i) - mesh[i].rotation.y) * 0.2;
		}
	}
	if (intersects.length && intersects[0].object) {
		const foucusObj = intersects[0].object.uuid;
		if (mesh[i].uuid === foucusObj) {
			foucusNum = i;
		}
	}
};

const speed = 2;
const particleAnima = () => {
	const positions = (particleGeometry.attributes.position as BufferAttribute).array as number[];
	for (let i = 0; i < particleCount; i++) {
		positions[i * 3 + 1] += speed;
		if (positions[i * 3 + 1] > range) {
			positions[i * 3] = Math.random() * range * 2 - (range * 2) / 2;
			positions[i * 3 + 1] = -range;
			positions[i * 3 + 2] = Math.random() * range * 2 - (range * 2) / 2;
		}
	}
	particleGeometry.attributes.position.needsUpdate = true;
};

let degree = 0;
let degreeReverse = 0;
const render = () => {
	requestAnimationFrame(() => {
		render();
	});

	// レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
	raycaster.setFromCamera(mouse, camera);
	// その光線とぶつかったオブジェクトを得る
	intersects = raycaster.intersectObjects(meshList);

	degree += 0.01;
	degreeReverse -= 0.01;
	if (degree >= 10) {
		degree = 0.01;
	}
	if (degreeReverse <= -10) {
		degreeReverse = -0.01;
	}
	for (let i = 0; i < mesh.length; i++) {
		if (i < 10) {
			cardRender(i, -70, degree);
		} else {
			cardRender(i, 80, degreeReverse);
		}
	}
	renderer.render(scene, camera);

	particleAnima();
};

window.addEventListener(
	'resize',
	() => {
		w = innerWidth;
		h = innerHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	},
	false
);

const init = () => {
	// setControll();
	render();
	canvas.value!.appendChild(renderer.domElement);
	canvas.value!.addEventListener('click', (event: MouseEvent) => {
		handleMouseMove(event);
		window.clearTimeout(flReset);
		window.clearTimeout(reverseFl);
		imgReverseFl = false;
		reverseFl = setTimeout(() => {
			imgReverseFl = true;
			window.clearTimeout(reverseFl);
		}, 1500);
		flReset = window.setTimeout(() => {
			foucusNum = -1;
			imgReverseFl = false;
		}, 1800);
	});
};

onMounted(() => {
	init();
});
</script>

<template>
	<div class="wrap">
		<div ref="canvas" id="canvas"></div>
		<p>Click Image!</p>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=BioRhyme&display=swap');
.wrap {
	position: relative;
}

#canvas {
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
}

p {
	width: 100%;
	font-size: 50px;
	text-align: center;
	color: white;
  font-family: BioRhyme;
  user-select: none;
	position: absolute;
	top: 120px;
	left: 0;
}
</style>
