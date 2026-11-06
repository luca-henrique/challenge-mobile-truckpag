import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthScreenRouteProp = RouteProp<RootStackParamList, 'Auth'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
