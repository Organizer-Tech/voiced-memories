interface AppRouteProps {
    GALLERY_PAGE: string;
    LOGIN_PAGE: string;
    MAIN_PAGE: string;
}

export const appRoutes: AppRouteProps = {
    GALLERY_PAGE: '/auth/user/gallery',
    LOGIN_PAGE: '/login',
    MAIN_PAGE: '/main',
};

const unprotectedRoutes = [appRoutes.LOGIN_PAGE];

export const getProtectedRoutes = (): string[] => {
    const routes = Object.values(appRoutes);
    const getProtectedRoutes = routes.filter((route) => !unprotectedRoutes.includes(route));
    return getProtectedRoutes;
}
