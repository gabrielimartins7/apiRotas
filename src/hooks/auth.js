/* eslint-disable @typescript-eslint/ban-types */
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import api from "../http/api";

const AuthContextData = createContext();

const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const [user] = await AsyncStorage.multiGet([
        "@app:user",
      ]);

      if (user[1]) {
        
        setUserAuth({
        
          user: JSON.parse(user[1]),
        });
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signUser = useCallback(async ({ email, password }) => {
     
    const response = await api.post("auth/sign_in", {
      "email": email,
      "password":password  
    });

   const { headers, data } = response;
   const { name } = data.data;  
   
    const user = {
      name: name,
    };

    await AsyncStorage.multiSet([
      ["@app:user", JSON.stringify(user)],
    ]);

    api.defaults.headers["access-token"] = headers["access-token"];
    api.defaults.headers.uid = headers.uid;
    api.defaults.headers.client = headers.client;

    setUserAuth({  user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@app:user"]);

    setUserAuth({});
  }, []);

  return (
    <AuthContextData.Provider
      value={{
        user: userAuth,
        loading,
        signUser,
        signOut,
      }}
    >
      {children}
    </AuthContextData.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContextData);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
