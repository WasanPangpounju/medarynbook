module.exports = {
  apps: [
    {
      name: "medarynbook",
      script: ".next/standalone/server.js",
      cwd: "/var/www/medarynbook",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
