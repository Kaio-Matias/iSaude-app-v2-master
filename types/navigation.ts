import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  ConnectType: undefined;
  NovaSenha: undefined;
  SenhaAlterada: undefined;
  PersonalInformationForm: undefined;
  ForgotPassword: undefined;
  // Rotas de Paciente
  PersonalInformationFormPacient: undefined;
  BasicInformationFormPacient: undefined;
  UserInformationFormPacient: undefined;
  PasswordInformationFormPacient: undefined;
  ConfirmRegisterPacient: undefined;
  // Rotas de Profissional
  PersonalInformationFormProfessional: undefined;
  BasicInformationFormProfessional: undefined;
  UserInformationFormProfessional: undefined;
  PasswordInformationFormProfessional: undefined;
  ProfessionalInformationFormProfessional: undefined;
  ConfirmRegisterProfessional: undefined;

    // Rotas de Clinicas
    PersonalInformationFormClinic: undefined;
    BasicInformationFormClinic: undefined;
    UserInformationFormClinic: undefined;
    PasswordInformationFormClinic: undefined;
    InstitutionalInformationFormClinic: undefined;
    ConfirmRegisterClinic: undefined;

  Polity: undefined;
  Terms: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 