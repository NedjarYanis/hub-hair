import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Scissors } from 'lucide-react-native'; 
import { useAuth } from '../contexts/AuthContext';

// Icône Google simple (SVG/Emoji pour éviter les imports lourds)
const GoogleIcon = () => <Text style={{ fontSize: 18, marginRight: 10 }}>G</Text>;

export const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError('Champs manquants');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (err: any) {
      setError('Erreur d\'identification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}><Scissors color="#FFF" size={32} /></View>
          <Text style={styles.title}>BarberGlass</Text>
        </View>

        <View style={styles.formContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.mainBtn} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>{isLogin ? 'Connexion' : "S'inscrire"}</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OU</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={() => signInWithGoogle()}>
            <GoogleIcon />
            <Text style={styles.googleBtnText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
            <Text style={styles.switchBtnText}>
              {isLogin ? "Créer un compte" : "Se connecter"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1F3A93', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  formContainer: { width: '100%' },
  input: { backgroundColor: '#1C1C1E', color: '#FFF', height: 55, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15, borderWidth: 1, borderColor: '#2A2A2C' },
  mainBtn: { backgroundColor: '#4285F4', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  orText: { color: '#666', marginHorizontal: 15, fontSize: 12, fontWeight: '700' },
  googleBtn: { backgroundColor: '#FFF', height: 55, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  googleBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  switchBtn: { marginTop: 25, alignItems: 'center' },
  switchBtnText: { color: '#888', fontSize: 14 },
  errorText: { color: '#EF4135', marginBottom: 15, textAlign: 'center' }
});