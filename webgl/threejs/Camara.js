/**
 *	Seminario GPC #2. FormaBasica
 *	Dibujar formas basicas con animacion
 *
 */

// Variables imprescindibles
let renderer, scene, camera;

// Variables globales
let esferacubo, cubo, esfera;
let l = b = -4;
let r = t = -l;
let cameraController;

// Acciones
init();
loadScene();
render();

function init() {
    // Crear el motor, la escena y la camara

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    //Tamaño dela area donde vamos a dibujar
    renderer.setSize(window.innerWidth,window.innerHeight);
    //Color con el que se formatea el contenedor
    renderer.setClearColor(new THREE.Color(0x0000AA));
    //Agregamos el elemento canvas de renderer al contenedor
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    let ar = window.innerWidth / window.innerHeight;// Razón de aspecto
    camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 100 ); // Inicializa camara (Angulo, razón de aspecto, Distancia con efecto, Distancia sin efecto)
    //camera = new THREE.OrthographicCamera(l, r, t, b, -20, 20);
    scene.add(camera);//Agregamos la camara a la escena
    camera.position.set(0.5,3,9);// Posición e la camara (Diferente a la posición  defecto)
    camera.lookAt(new THREE.Vector3(0,0,0)); // A donde esta mirando la cámara

    // Controlador de camara
    cameraController = new THREE.OrbitControls( camera, renderer.domElement );
    cameraController.target.set(0,0,0);
    cameraController.noKeys = true;

    // Captura de evetos
    window.addEventListener('resize', updateAspectRatio);
    renderer.domElement.addEventListener('dblclick', rotate);
}

function loadScene() {
    // Cargar la escena con objetos

    // Materiales
    let material1 = new THREE.MeshBasicMaterial({
        color:new THREE.Color("rgb(255, 64, 0)"),
        wireframe:true
    });
    let material2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(64, 255, 0)"),
        wireframe:true
    });
    //Le decimos que contruya el objeto amarillo y que solo muestre las aristas

    // Geometrias
    let geocubo = new THREE.BoxGeometry(2,2,2); // Geometría del cubo
    let geoesfera = new THREE.SphereGeometry(1, 30, 30);

    // Objetos
    cubo = new THREE.Mesh( geocubo, material1 );// Dobujamos un cubo
    cubo.position.x = -1;

    esfera = new THREE.Mesh( geoesfera, material2 );
    esfera.position.x = 1;

    esferacubo = new THREE.Object3D();
    esferacubo.position.y = 1;

    // Modelo importado
    var loader = new THREE.ObjectLoader();
    loader.load( 'models/soldado/soldado.json' ,
        function(obj){
            obj.position.y = 1;
            cubo.add(obj);
        });

    // Construir la escena
    esferacubo.add(cubo);
    esferacubo.add(esfera);
    scene.add(esferacubo);
    cubo.add(new THREE.AxisHelper(1)); // Ayudante de ejes para el cubo
    scene.add( new THREE.AxisHelper(3) ); // Ayudante de ejes para la escena

}

function updateAspectRatio() {
    // Indicarle al motor las nuevas dimensiones del canvas
    // Renueva la relación de aspecto de la camara
    // Ajustar el tamaño del canvas
    renderer.setSize(window.innerWidth,window.innerHeight);
    // Razón de aspecto
    let ar = window.innerWidth/window.innerHeight;

    // Para camara ortográfica
    /*if (ar > 1) {
        camera.left = l * ar;
        camera.right = r * ar;
        camera.bottom = l;
        camera.top = r;
    } else {
        camera.left = l;
        camera.right = r;
        camera.bottom = l * ar;
        camera.top = r * ar;
    }*/

    // Para camara perpectiva
    camera.aspect = ar;

    camera.updateProjectionMatrix();
}

function rotate(event)  {
    // Localiza el objeto seleccionado y lo gira 45 grados
    let x = event.clientX;
    let y = event.clientY;

    // Convertir al cuadrado canonico (2x2)
    x = ( x/window.innerWidth ) * 2 - 1;
    y = -( y/window.innerHeight ) * 2 + 1;

    // Construccion del rayo e interseccion con a escena
    let rayo = new THREE.Raycaster();
    rayo.setFromCamera( new THREE.Vector2(x,y), camera);

    //Capturar las intersecciones
    var interseccion = rayo.intersectObjects( scene.children, true );

    if(interseccion.length>0)
        interseccion[0].object.rotation.y += Math.PI / 4;
}

function update() {
    // Cambios entre frames
}

function render() {
    // Dibujar cada frame y lo muestra
    requestAnimationFrame(render);// Llega el evento de dibujo en llamada recursiva
    update();//Actualiza la escena
    renderer.render( scene, camera ); // Le decimos al motor que renderice
}