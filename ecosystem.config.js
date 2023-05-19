module.exports = {
    apps: [
        {
            name: "tm-server",
            script: "src/index.ts",
            watch: true,
            autorestart: true,
            ignore_watch: ["node_modules"],
            watch_delay: 1000,
            restart_delay: 5000,
        },
        {
            name: "dev",
            script: "npm",
            args: "run dev",
            watch: true,
            autorestart: true,
            ignore_watch: ["node_modules"],
            watch_delay: 1000,
            restart_delay: 5000,
        },
    ],
};
