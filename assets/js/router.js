// router.js
export class Router {
    constructor(defaultRoute = '/') {
        this.routes = [];
        this.defaultRoute = defaultRoute;
        this.currentCleanup = null;

        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());
    }

    add(path, loader) {
        const paramNames = [];

        const regexPath = path.replace(/:([^/]+)/g, (_, key) => {
            paramNames.push(key);
            return '([^/]+)';
        });

        const regex = new RegExp(`^${regexPath}$`);
        this.routes.push({ regex, loader, paramNames });

        return this;
    }

    async route() {
        const hash = location.hash.slice(1) || this.defaultRoute;

        for (const route of this.routes) {
            const match = hash.match(route.regex);

            if (match) {
                // cleanup previous page
                if (typeof this.currentCleanup === 'function') {
                    this.currentCleanup();
                    this.currentCleanup = null;
                }

                const params = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];
                });

                // load page lazily
                const cleanup = await route.loader(params);

                if (typeof cleanup === 'function') {
                    this.currentCleanup = cleanup;
                }

                return;
            }
        }

        // fallback to default route
        this.navigate(this.defaultRoute);
    }

    navigate(path) {
        location.hash = path;
    }
} 