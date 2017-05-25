const {createDeployment, Machine, Range, githubKeys, LabelRule} = require("@quilt/quilt");

var redis = require("@quilt/redis");
var redis_service = new redis.Redis(1, "AUTH_PASSWORD");

redis_service.exclusive();

var flask_service = new Service(
    "flask_service",
    [new Container("osalpekar/test-service:latest")]
);

// var redis_service = new Service(
//     "redis_service",
//     [new Container("redis:latest")]
// );

publicInternet.connect(80, flask_service);
flask_service.connect(80, publicInternet);

var namespace = createDeployment({});

var baseMachine = new Machine({
    provider: "Amazon",
    size: "m4.large",
    sshKeys: githubKeys("osalpekar"),
});

namespace.deploy(baseMachine.asMaster());
namespace.deploy(baseMachine.asWorker().replicate(3));

namespace.deploy(redis_service);
namespace.deploy(flask_service);
