import { clearAuth, setAuth } from "@/app/features/auth/authSlice";
import { useAppDispatch } from "@/app/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

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
    }
    if (status === "loading") {
      dispatch(
        setAuth({
          status,
          user: undefined,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [dispatch, session, status]);

  return null;
}

/* 
session?.user
? {
    id: session.user.id ?? "",
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? undefined,
    }
: 
*/
