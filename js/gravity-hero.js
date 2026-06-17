document.addEventListener('DOMContentLoaded', function() {
    var hero = document.querySelector('.hero');
    var stage = document.querySelector('.gravity-stage');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gravity-item'));

    if (!hero || !stage || !items.length || !window.Matter) {
        return;
    }

    var Engine = Matter.Engine;
    var Runner = Matter.Runner;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var Composite = Matter.Composite;
    var Mouse = Matter.Mouse;
    var MouseConstraint = Matter.MouseConstraint;
    var Sleeping = Matter.Sleeping;

    var engine = Engine.create();
    var runner = Runner.create();
    var itemBodies = [];
    var wallBodies = [];
    var mouseConstraint = null;
    var activeMouse = null;
    var hasStarted = false;
    var resizeTimer = null;
    var startTimer = null;
    var pointer = {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        speedX: 0,
        speedY: 0,
        active: false,
    };

    engine.gravity.y = 1.05;
    engine.enableSleeping = false;

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    function getHeroRect() {
        return hero.getBoundingClientRect();
    }

    function addWalls() {
        var rect = getHeroRect();
        var width = rect.width;
        var height = rect.height;
        var thickness = 160;

        wallBodies = [
            Bodies.rectangle(width / 2, height + thickness / 2 - 24, width + thickness * 2, thickness, {
                isStatic: true,
            }),
            Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 3, {
                isStatic: true,
            }),
            Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 3, {
                isStatic: true,
            }),
        ];

        Composite.add(engine.world, wallBodies);
    }

    function createItemBodies() {
        var rect = getHeroRect();
        var width = rect.width;
        var height = rect.height;

        itemBodies = items.map(function(item, index) {
            var itemRect = item.getBoundingClientRect();
            var itemWidth = itemRect.width;
            var itemHeight = itemRect.height;
            var x = random(itemWidth * 0.55, width - itemWidth * 0.55);
            var y = -itemHeight - random(80, height * 0.9) - index * 54;
            var body = Bodies.rectangle(x, y, itemWidth, itemHeight, {
                restitution: 0.42,
                friction: 0.48,
                frictionAir: 0.012,
                density: item.tagName.toLowerCase() === 'img' ? 0.0018 : 0.0024,
                chamfer: { radius: item.classList.contains('gravity-text') ? 8 : 16 },
            });

            Body.rotate(body, random(-0.45, 0.45));
            Body.setVelocity(body, {
                x: random(-3.2, 3.2),
                y: random(1.2, 4.8),
            });
            Body.setAngularVelocity(body, random(-0.055, 0.055));

            return {
                element: item,
                body: body,
                width: itemWidth,
                height: itemHeight,
            };
        });

        Composite.add(engine.world, itemBodies.map(function(itemBody) {
            return itemBody.body;
        }));
    }

    function syncDomToBodies() {
        var rect = getHeroRect();
        var width = rect.width;
        var height = rect.height;

        itemBodies.forEach(function(itemBody) {
            var body = itemBody.body;

            Sleeping.set(body, false);

            if (
                body.position.y > height + 260 ||
                body.position.x < -260 ||
                body.position.x > width + 260
            ) {
                Body.setPosition(body, {
                    x: random(itemBody.width * 0.6, width - itemBody.width * 0.6),
                    y: -itemBody.height - random(80, 360),
                });
                Body.setVelocity(body, {
                    x: random(-2.2, 2.2),
                    y: random(1.5, 3.8),
                });
                Body.setAngularVelocity(body, random(-0.045, 0.045));
            }

            itemBody.element.style.transform = [
                'translate(' + (body.position.x - itemBody.width / 2) + 'px, ' + (body.position.y - itemBody.height / 2) + 'px)',
                'rotate(' + body.angle + 'rad)',
            ].join(' ');
        });
    }

    function pushBodiesFromPointer(event) {
        if (!hasStarted) {
            return;
        }

        var rect = getHeroRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        if (!pointer.active) {
            pointer.prevX = x;
            pointer.prevY = y;
            pointer.active = true;
        }

        pointer.speedX = x - pointer.prevX;
        pointer.speedY = y - pointer.prevY;
        pointer.prevX = x;
        pointer.prevY = y;
        pointer.x = x;
        pointer.y = y;

        itemBodies.forEach(function(itemBody) {
            var body = itemBody.body;
            var dx = body.position.x - pointer.x;
            var dy = body.position.y - pointer.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var sizeFactor = Math.max(1, Math.min(3.2, Math.max(itemBody.width, itemBody.height) / 120));
            var radius = Math.max(150, Math.min(420, itemBody.width * 1.15 + sizeFactor * 60));

            if (distance > radius || distance < 1) {
                return;
            }

            var strength = (1 - distance / radius) * 0.07 * sizeFactor;
            var velocityBoost = Math.min(2.2, Math.sqrt(pointer.speedX * pointer.speedX + pointer.speedY * pointer.speedY) / 28);
            var force = strength * (1 + velocityBoost);

            Body.applyForce(body, body.position, {
                x: (dx / distance) * force + pointer.speedX * 0.0009,
                y: (dy / distance) * force + pointer.speedY * 0.0009,
            });
            Body.setAngularVelocity(body, body.angularVelocity + random(-0.018, 0.018));
        });
    }

    function addMouseControl() {
        var mouse = Mouse.create(hero);
        activeMouse = mouse;

        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.16,
                damping: 0.08,
                render: {
                    visible: false,
                },
            },
        });

        Composite.add(engine.world, mouseConstraint);
    }

    function releasePointer() {
        if (activeMouse) {
            activeMouse.button = -1;
        }

        if (mouseConstraint) {
            mouseConstraint.body = null;
            mouseConstraint.constraint.bodyB = null;
            mouseConstraint.constraint.pointB = null;
        }
    }

    function clearWorld() {
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        itemBodies = [];
        wallBodies = [];
        mouseConstraint = null;
        activeMouse = null;
    }

    function start() {
        if (hasStarted) {
            return;
        }

        window.clearTimeout(startTimer);
        hasStarted = true;
        addWalls();
        createItemBodies();
        addMouseControl();
        syncDomToBodies();
        hero.classList.add('is-dropped');
        Runner.run(runner, engine);

        (function render() {
            syncDomToBodies();
            requestAnimationFrame(render);
        })();
    }

    function restart() {
        if (!hasStarted) {
            return;
        }

        clearWorld();
        addWalls();
        createItemBodies();
        addMouseControl();
        syncDomToBodies();
        Runner.run(runner, engine);
    }

    function waitForImages() {
        var imagePromises = items
            .filter(function(item) {
                return item.tagName.toLowerCase() === 'img' && !item.complete;
            })
            .map(function(img) {
                return new Promise(function(resolve) {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            });

        return Promise.all(imagePromises);
    }

    waitForImages().then(function() {
        startTimer = window.setTimeout(start, 2000);
    });

    hero.addEventListener('pointerdown', start);

    window.addEventListener('resize', function() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(restart, 220);
    });

    window.addEventListener('mouseup', releasePointer);
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('touchend', releasePointer);
    window.addEventListener('touchcancel', releasePointer);
    hero.addEventListener('pointermove', pushBodiesFromPointer);
    hero.addEventListener('pointerleave', function() {
        pointer.active = false;
    });
});
