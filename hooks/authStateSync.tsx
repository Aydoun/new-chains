export function AuthStateSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setAuth({
          status,
          user: {
            id: session.user.id ?? "",
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            image: session.user.image ?? undefined,
          },
        })
      );
    } else if (status === "loading") {
      dispatch(
        setAuth({
          status,
          user: session?.user
            ? {
                id: session.user.id ?? "",
                name: session.user.name ?? "",
                email: session.user.email ?? "",
                image: session.user.image ?? undefined,
              }
            : undefined,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [dispatch, session, status]);

  return null;
}
