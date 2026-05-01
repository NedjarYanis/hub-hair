import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Scissors } from 'lucide-react-native';

export const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Mode Connexion
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Mode Inscription
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // On attache le nom à son profil Firebase
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (err: any) {
      // Gestion des erreurs Firebase
      if (err.code === 'auth/invalid-email') setError('Email invalide.');
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') setError('Identifiants incorrects.');
      else if (err.code === 'auth/email-already-in-use') setError('Cet email est déjà utilisé.');
      else setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Scissors color="#FFF" size={32} />
          </View>
          <Text style={styles.title}>BarberGlass</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Bon retour parmi nous' : 'Créez votre compte'}</Text>
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
            placeholder="Adresse email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe (6 car. min)"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.mainBtn} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>{isLogin ? 'Se connecter' : "S'inscrire"}</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(''); }} style={styles.switchBtn}>
            <Text style={styles.switchBtnText}>
              {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1F3A93', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '800', letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 16, marginTop: 8 },
  formContainer: { width: '100%' },
  input: { backgroundColor: '#1C1C1E', color: '#FFF', height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2C' },
  mainBtn: { backgroundColor: '#4285F4', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  switchBtn: { marginTop: 24, alignItems: 'center' },
  switchBtnText: { color: '#888', fontSize: 14, fontWeight: '500' },
  errorText: { color: '#EF4135', marginBottom: 16, textAlign: 'center', fontWeight: '500' }
});