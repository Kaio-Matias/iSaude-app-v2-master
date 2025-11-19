import React, { createContext, useContext, useState } from 'react';

// Tipagem completa baseada nos seus formulários
type RegisterData = {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  username?: string;
  password?: string;
  role?: 'PACIENTE' | 'PROFISSIONAL' | 'CLINICA';
};

interface RegisterContextType {
  data: RegisterData;
  updateData: (newData: Partial<RegisterData>) => void;
  clearData: () => void;
}

const RegisterContext = createContext<RegisterContextType>({} as RegisterContextType);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RegisterData>({});

  const updateData = (newData: Partial<RegisterData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      console.log('📦 Dados do Cadastro:', updated); // Para você ver no console
      return updated;
    });
  };

  const clearData = () => setData({});

  return (
    <RegisterContext.Provider value={{ data, updateData, clearData }}>
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegister = () => useContext(RegisterContext);