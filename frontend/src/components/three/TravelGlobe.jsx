import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Plane, Compass, Globe2, Radio, Navigation } from 'lucide-react';

// Predefined corridors with geographical and travel telemetry
const CORRIDORS = [
  {
    id: 'hyd-vja',
    origin: 'Hyderabad',
    originCode: 'HYD',
    originLat: 17.385,
    originLon: 78.4867,
    destination: 'Vijayawada',
    destinationCode: 'VJA',
    destLat: 16.5062,
    destLon: 80.648,
    distanceKm: 274,
    airTime: '50m',
    trainTime: '4h 30m',
    demandScore: 84,
    crowdLevel: 'HIGH',
    weather: '31°C Clear',
    festival: 'Dussehra Navaratri Surge'
  },
  {
    id: 'blr-goa',
    origin: 'Bangalore',
    originCode: 'BLR',
    originLat: 12.9716,
    originLon: 77.5946,
    destination: 'Goa',
    destinationCode: 'GOI',
    destLat: 15.2993,
    destLon: 74.124,
    distanceKm: 560,
    airTime: '1h 15m',
    trainTime: '11h 20m',
    demandScore: 68,
    crowdLevel: 'MEDIUM',
    weather: '29°C Sunny',
    festival: 'Weekend Beach Migration'
  },
  {
    id: 'bom-del',
    origin: 'Mumbai',
    originCode: 'BOM',
    originLat: 19.076,
    originLon: 72.8777,
    destination: 'Delhi',
    destinationCode: 'DEL',
    destLat: 28.6139,
    destLon: 77.209,
    distanceKm: 1150,
    airTime: '2h 10m',
    trainTime: '16h 00m',
    demandScore: 92,
    crowdLevel: 'VERY HIGH',
    weather: '28°C Moderate',
    festival: 'National Trunk Trunk Volume'
  },
  {
    id: 'hyd-tpt',
    origin: 'Hyderabad',
    originCode: 'HYD',
    originLat: 17.385,
    originLon: 78.4867,
    destination: 'Tirupati',
    destinationCode: 'TIR',
    destLat: 13.6288,
    destLon: 79.4192,
    distanceKm: 550,
    airTime: '1h 10m',
    trainTime: '9h 15m',
    demandScore: 78,
    crowdLevel: 'HIGH',
    weather: '30°C Clear',
    festival: 'Brahmotsavam Pilgrimage'
  }
];

// Helper to convert lat/long to 3D Cartesian coordinates on sphere
function latLongToVector3(lat, lon, radius, alt = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + alt;
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function TravelGlobe({
  activeOrigin = 'Hyderabad',
  activeDestination = 'Vijayawada',
  onSelectRoute = null,
  interactive = true,
  height = '480px'
}) {
  const containerRef = useRef(null);
  const [activeCorridor, setActiveCorridor] = useState(CORRIDORS[0]);
  const [viewMode, setViewMode] = useState('corridor'); // 'corridor' | 'globe' | 'radar'

  // Sync corridor selection when props change
  useEffect(() => {
    const matched = CORRIDORS.find(
      (c) =>
        (c.origin.toLowerCase() === activeOrigin.toLowerCase() &&
          c.destination.toLowerCase() === activeDestination.toLowerCase()) ||
        c.origin.toLowerCase() === activeOrigin.toLowerCase()
    );
    if (matched) {
      setActiveCorridor(matched);
    }
  }, [activeOrigin, activeDestination]);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene, camera, renderer, controls, animFrameId;
    let mainGroup = new THREE.Group();
    let planeMesh, curvePath;
    let flightProgress = 0;

    const width = containerRef.current.clientWidth || 600;
    const heightPx = parseInt(height, 10) || 480;

    try {
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);

      // Renderer with antialias and alpha
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Clean container & attach canvas
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);

      // Studio Lighting (Cool Deep Slate, Cyan, and Sapphire Moonlight)
      const ambientLight = new THREE.AmbientLight(0x1e293b, 2.2);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
      sunLight.position.set(12, 18, 14);
      sunLight.castShadow = true;
      scene.add(sunLight);

      const rimLight = new THREE.DirectionalLight(0x818cf8, 1.8);
      rimLight.position.set(-14, 10, -10);
      scene.add(rimLight);

      scene.add(mainGroup);

      // OrbitControls for smooth interaction
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.7;
      controls.enablePan = false;

      // =========================================================================
      // SCENE BUILDER: VIEW MODES
      // =========================================================================

      if (viewMode === 'corridor') {
        // ---------------------------------------------------------------------
        // MODE 1: 3D PERSPECTIVE FLIGHT CORRIDOR (Executive Cyber Blue)
        // ---------------------------------------------------------------------
        camera.position.set(0, 7.5, 14);
        controls.target.set(0, 1.2, 0);
        controls.minDistance = 8;
        controls.maxDistance = 24;
        controls.maxPolarAngle = Math.PI / 2.1; // Don't go below ground

        // Ground Plane (Deep Navy Slate Cartographic Grid)
        const gridGeo = new THREE.PlaneGeometry(24, 16, 24, 16);
        const gridMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.8,
          metalness: 0.2
        });
        const ground = new THREE.Mesh(gridGeo, gridMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        mainGroup.add(ground);

        // Grid lines overlay in electric blue and slate
        const gridHelper = new THREE.GridHelper(24, 24, 0x3b82f6, 0x1e293b);
        gridHelper.position.y = 0.02;
        mainGroup.add(gridHelper);

        // Origin Terminal Platform (Hyderabad)
        const originPlatformGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.25, 24);
        const originPlatformMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.4 });
        const originPlatform = new THREE.Mesh(originPlatformGeo, originPlatformMat);
        originPlatform.position.set(-5, 0.12, 0);
        mainGroup.add(originPlatform);

        // Origin Beacon Tower
        const originTowerGeo = new THREE.CylinderGeometry(0.15, 0.25, 1.4, 12);
        const towerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
        const originTower = new THREE.Mesh(originTowerGeo, towerMat);
        originTower.position.set(-5, 0.8, 0);
        mainGroup.add(originTower);

        // Beacon Glowing Sphere
        const beaconLightGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const beaconLightMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const originBeacon = new THREE.Mesh(beaconLightGeo, beaconLightMat);
        originBeacon.position.set(-5, 1.6, 0);
        mainGroup.add(originBeacon);

        // Destination Terminal Platform (Vijayawada)
        const destPlatformGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.25, 24);
        const destPlatformMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.4 });
        const destPlatform = new THREE.Mesh(destPlatformGeo, destPlatformMat);
        destPlatform.position.set(5, 0.12, 0);
        mainGroup.add(destPlatform);

        // Destination Beacon Tower
        const destTower = new THREE.Mesh(originTowerGeo, towerMat);
        destTower.position.set(5, 0.8, 0);
        mainGroup.add(destTower);

        // Destination Glowing Sphere
        const destBeaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const destBeacon = new THREE.Mesh(beaconLightGeo, destBeaconMat);
        destBeacon.position.set(5, 1.6, 0);
        mainGroup.add(destBeacon);

        // En-route Waypoints (Suryapet & Nalgonda Corridor)
        const waypointGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16);
        const waypointMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 });
        const wp1 = new THREE.Mesh(waypointGeo, waypointMat);
        wp1.position.set(-1.8, 0.05, 0.4);
        mainGroup.add(wp1);

        const wp2 = new THREE.Mesh(waypointGeo, waypointMat);
        wp2.position.set(1.8, 0.05, -0.4);
        mainGroup.add(wp2);

        // Parabolic Flight Trajectory Arc
        const pStart = new THREE.Vector3(-5, 1.6, 0);
        const pMid = new THREE.Vector3(0, 5.2, 0); // elevated cruising altitude
        const pEnd = new THREE.Vector3(5, 1.6, 0);

        curvePath = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);
        const arcPoints = curvePath.getPoints(60);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMat = new THREE.LineDashedMaterial({
          color: 0x38bdf8,
          linewidth: 3,
          scale: 1,
          dashSize: 0.4,
          gapSize: 0.2
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcLine.computeLineDistances();
        mainGroup.add(arcLine);

        // Shadow projection line along the ground
        const shadowCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(-5, 0.05, 0),
          new THREE.Vector3(0, 0.05, 0),
          new THREE.Vector3(5, 0.05, 0)
        );
        const shadowPoints = shadowCurve.getPoints(30);
        const shadowGeo = new THREE.BufferGeometry().setFromPoints(shadowPoints);
        const shadowLine = new THREE.Line(
          shadowGeo,
          new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 2 })
        );
        mainGroup.add(shadowLine);

        // Realistic Modeled 3D Airplane Mesh
        const planeGroup = new THREE.Group();

        // Fuselage
        const fuseGeo = new THREE.ConeGeometry(0.22, 1.1, 12);
        const fuseMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.8,
          roughness: 0.2
        });
        const fuse = new THREE.Mesh(fuseGeo, fuseMat);
        fuse.rotation.x = Math.PI / 2;
        planeGroup.add(fuse);

        // Main Swept Wings
        const wingsGeo = new THREE.BoxGeometry(1.6, 0.03, 0.35);
        const wingsMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.6 });
        const wings = new THREE.Mesh(wingsGeo, wingsMat);
        wings.position.set(0, 0, -0.1);
        planeGroup.add(wings);

        // Tail Vertical Stabilizer
        const tailGeo = new THREE.BoxGeometry(0.04, 0.4, 0.25);
        const tail = new THREE.Mesh(tailGeo, wingsMat);
        tail.position.set(0, 0.2, -0.45);
        planeGroup.add(tail);

        // Twin Jet Engines
        const engineGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8);
        const engineMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
        const engL = new THREE.Mesh(engineGeo, engineMat);
        engL.rotation.x = Math.PI / 2;
        engL.position.set(-0.4, -0.06, -0.1);
        planeGroup.add(engL);

        const engR = new THREE.Mesh(engineGeo, engineMat);
        engR.rotation.x = Math.PI / 2;
        engR.position.set(0.4, -0.06, -0.1);
        planeGroup.add(engR);

        // Jet Exhaust Light Glow
        const exhaustGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const exhaustL = new THREE.Mesh(exhaustGeo, exhaustMat);
        exhaustL.position.set(-0.4, -0.06, -0.28);
        planeGroup.add(exhaustL);
        const exhaustR = new THREE.Mesh(exhaustGeo, exhaustMat);
        exhaustR.position.set(0.4, -0.06, -0.28);
        planeGroup.add(exhaustR);

        planeMesh = planeGroup;
        mainGroup.add(planeMesh);
      } else if (viewMode === 'globe') {
        // ---------------------------------------------------------------------
        // MODE 2: 3D WORLD GLOBE (Deep Oceanic Slate & Neon Cyan Corridors)
        // ---------------------------------------------------------------------
        camera.position.set(0, 0, 16);
        controls.target.set(0, 0, 0);
        controls.minDistance = 9;
        controls.maxDistance = 28;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;

        const GLOBE_RADIUS = 5.2;

        // High-Quality Procedural Cartographic Canvas Texture
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Deep Oceanic Background
        ctx.fillStyle = '#0B1120';
        ctx.fillRect(0, 0, 2048, 1024);

        // Cartographic Meridian & Parallel Grid Lines
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 2048; x += 128) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1024);
          ctx.stroke();
        }
        for (let y = 0; y <= 1024; y += 128) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(2048, y);
          ctx.stroke();
        }

        // Equator Highlight
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 512);
        ctx.lineTo(2048, 512);
        ctx.stroke();

        // Draw Continental Landmass Shapes in Modern Dark Slate
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;

        // India & South Asia detailed polygon
        const indiaPoints = [
          [68, 24], [72, 21], [73, 19], [74, 15], [76, 10], [77.5, 8.2],
          [79, 10], [80.3, 13], [80.6, 16.5], [83, 18], [86, 20], [88, 22],
          [92, 26], [88, 28], [82, 30], [77, 34], [74, 34], [70, 28]
        ];
        ctx.beginPath();
        indiaPoints.forEach(([lon, lat], idx) => {
          const px = ((lon + 180) / 360) * 2048;
          const py = ((90 - lat) / 180) * 1024;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Eurasia
        ctx.beginPath();
        const asiaPoints = [
          [40, 40], [60, 50], [90, 60], [120, 65], [140, 55], [130, 35],
          [110, 20], [100, 10], [85, 24], [60, 25], [50, 30]
        ];
        asiaPoints.forEach(([lon, lat], idx) => {
          const px = ((lon + 180) / 360) * 2048;
          const py = ((90 - lat) / 180) * 1024;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Africa
        ctx.beginPath();
        const africaPoints = [
          [-15, 30], [30, 32], [50, 12], [40, -10], [30, -32], [18, -34],
          [10, -10], [0, 5], [-17, 15]
        ];
        africaPoints.forEach(([lon, lat], idx) => {
          const px = ((lon + 180) / 360) * 2048;
          const py = ((90 - lat) / 180) * 1024;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // City light beacons on texture
        ctx.fillStyle = '#38BDF8';
        // Hyderabad
        ctx.beginPath();
        ctx.arc(((78.48 + 180) / 360) * 2048, ((90 - 17.38) / 180) * 1024, 8, 0, Math.PI * 2);
        ctx.fill();

        // Vijayawada
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(((80.64 + 180) / 360) * 2048, ((90 - 16.5) / 180) * 1024, 7, 0, Math.PI * 2);
        ctx.fill();

        const earthTexture = new THREE.CanvasTexture(canvas);
        const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
        const globeMat = new THREE.MeshStandardMaterial({
          map: earthTexture,
          roughness: 0.7,
          metalness: 0.2
        });
        const globeSphere = new THREE.Mesh(globeGeo, globeMat);
        mainGroup.add(globeSphere);

        // Atmosphere Rim Glow
        const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
        const atmosMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide
        });
        const atmos = new THREE.Mesh(atmosGeo, atmosMat);
        mainGroup.add(atmos);

        // Destination 3D Beacons
        const hydPos = latLongToVector3(17.385, 78.4867, GLOBE_RADIUS, 0.1);
        const vjaPos = latLongToVector3(16.5062, 80.648, GLOBE_RADIUS, 0.1);

        const pinGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const pinMatHyd = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const hydPin = new THREE.Mesh(pinGeo, pinMatHyd);
        hydPin.position.copy(hydPos);
        mainGroup.add(hydPin);

        const pinMatVja = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const vjaPin = new THREE.Mesh(pinGeo, pinMatVja);
        vjaPin.position.copy(vjaPos);
        mainGroup.add(vjaPin);

        // 3D Parabolic Curve on Globe
        const midPoint = hydPos.clone().add(vjaPos).multiplyScalar(0.5);
        midPoint.setLength(GLOBE_RADIUS + 1.6); // elevated
        curvePath = new THREE.QuadraticBezierCurve3(hydPos, midPoint, vjaPos);
        const cPoints = curvePath.getPoints(50);
        const cGeo = new THREE.BufferGeometry().setFromPoints(cPoints);
        const cMat = new THREE.LineDashedMaterial({
          color: 0x38bdf8,
          dashSize: 0.3,
          gapSize: 0.15,
          linewidth: 2
        });
        const cLine = new THREE.Line(cGeo, cMat);
        cLine.computeLineDistances();
        mainGroup.add(cLine);

        // Initial orientation towards India
        mainGroup.rotation.y = -Math.PI * 0.44;
        mainGroup.rotation.x = 0.22;
      } else {
        // ---------------------------------------------------------------------
        // MODE 3: TRANSIT CONGESTION RADAR (Clean Tactical Neon Sweep)
        // ---------------------------------------------------------------------
        camera.position.set(0, 0, 14);
        controls.target.set(0, 0, 0);
        controls.enableRotate = false;

        // Circular Radar Ring
        const radarGeo = new THREE.RingGeometry(1.5, 5.5, 64);
        const radarMat = new THREE.MeshBasicMaterial({
          color: 0x0f172a,
          side: THREE.DoubleSide
        });
        const radarMesh = new THREE.Mesh(radarGeo, radarMat);
        mainGroup.add(radarMesh);

        // Concentric Circles
        for (let r = 1.5; r <= 5.5; r += 1.3) {
          const ringGeo = new THREE.RingGeometry(r - 0.03, r, 64);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, side: THREE.DoubleSide });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          mainGroup.add(ring);
        }

        // Crosshairs
        const crossGeoH = new THREE.PlaneGeometry(11, 0.04);
        const crossMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
        const crossH = new THREE.Mesh(crossGeoH, crossMat);
        mainGroup.add(crossH);

        const crossGeoV = new THREE.PlaneGeometry(0.04, 11);
        const crossV = new THREE.Mesh(crossGeoV, crossMat);
        mainGroup.add(crossV);

        // Rotating Sweep Line
        const sweepGeo = new THREE.PlaneGeometry(5.5, 0.08);
        const sweepMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
        const sweepLine = new THREE.Mesh(sweepGeo, sweepMat);
        sweepLine.position.x = 2.75;
        const sweepPivot = new THREE.Group();
        sweepPivot.add(sweepLine);
        mainGroup.add(sweepPivot);

        // Pulse Hotspots for Transit Corridors
        const spotGeo = new THREE.CircleGeometry(0.3, 16);
        const spot1 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        spot1.position.set(2.2, 1.4, 0.05); // Air corridor: High demand
        mainGroup.add(spot1);

        const spot2 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0x818cf8 }));
        spot2.position.set(-1.8, 2.5, 0.05); // Road NH65
        mainGroup.add(spot2);

        const spot3 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0x10b981 }));
        spot3.position.set(1.0, -3.2, 0.05); // Rail
        mainGroup.add(spot3);

        planeMesh = sweepPivot; // will rotate in animation
      }

      // =========================================================================
      // ANIMATION LOOP
      // =========================================================================
      let clock = new THREE.Clock();

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (controls) controls.update();

        if (viewMode === 'corridor') {
          // Flight progression
          flightProgress += delta * 0.22;
          if (flightProgress > 1) flightProgress = 0;

          if (curvePath && planeMesh) {
            const currentPos = curvePath.getPointAt(flightProgress);
            const nextPos = curvePath.getPointAt(Math.min(flightProgress + 0.02, 1));
            planeMesh.position.copy(currentPos);
            planeMesh.lookAt(nextPos);

            // Natural bank angle
            const banking = Math.sin(flightProgress * Math.PI) * 0.2;
            planeMesh.rotation.z += banking;
          }
        } else if (viewMode === 'radar') {
          if (planeMesh) {
            planeMesh.rotation.z -= delta * 1.5;
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const newWidth = containerRef.current.clientWidth;
        camera.aspect = newWidth / heightPx;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, heightPx);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener('resize', handleResize);
        if (controls) controls.dispose();
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn('Three.js scene error:', err);
    }
  }, [viewMode, height, activeCorridor]);

  const handleSelectCorridor = (c) => {
    setActiveCorridor(c);
    if (onSelectRoute) {
      onSelectRoute(c.origin, c.destination);
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* 1. Interactive Header Bar with Mode Switcher & Live Corridor Badge */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                {activeCorridor.origin} ✈ {activeCorridor.destination}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                {activeCorridor.crowdLevel} {activeCorridor.demandScore}%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {activeCorridor.festival} • {activeCorridor.distanceKm} km
            </span>
          </div>
        </div>

        {/* 3D Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-bold shadow-xs">
          <button
            onClick={() => setViewMode('corridor')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'corridor'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>3D Corridor</span>
          </button>

          <button
            onClick={() => setViewMode('globe')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'globe'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>3D Earth</span>
          </button>

          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Radar</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full relative cursor-grab active:cursor-grabbing"
        style={{ height }}
      />

      {/* 3. Floating 3D Telemetry Overlay Badges */}
      <div className="absolute top-20 left-4 z-10 pointer-events-none hidden sm:block">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Corridor Telemetry
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-extrabold text-white">
              Air: <strong>{activeCorridor.airTime}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">
              Ground: <strong>{activeCorridor.trainTime}</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold block">
            Weather: {activeCorridor.weather}
          </span>
        </div>
      </div>

      <div className="absolute bottom-16 right-4 z-10 pointer-events-none hidden sm:block max-w-[210px]">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
            AI Smart Re-Route
          </span>
          <p className="text-[11px] text-slate-300 font-semibold leading-tight">
            Departing on <strong className="text-white">Oct 18 or 22</strong> reduces crowd congestion by <strong className="text-emerald-400">35%</strong>.
          </p>
        </div>
      </div>

      {/* 4. Bottom Corridor Quick Switcher */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 z-20 text-xs">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          Quick Corridors:
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {CORRIDORS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCorridor(c)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCorridor.id === c.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {c.originCode} ✈ {c.destinationCode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
