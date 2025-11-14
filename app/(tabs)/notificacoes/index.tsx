import { notificationService } from '@/components/notifications/NotificationService';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTabBadges } from '@/hooks/useTabBadges';
import { useRouter } from 'expo-router';

export default function NotificacoesScreen() {
	const router = useRouter();
	const { updateBadge } = useTabBadges();

	useEffect(() => {
		// Marcar todas as notificações como lidas quando a tela é aberta
		notificationService.markAllAsRead();
		// Atualizar badge da tab home para 0 (notificações lidas)
		updateBadge('home', 0);
	}, [updateBadge]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/home')}>
					<Ionicons name="arrow-back" size={24} color="#1E2532" />
				</TouchableOpacity>
				<Text style={styles.title}>Notificações</Text>
			</View>
			<NotificationsList />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F7F8FA', paddingTop: 32 },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
		backgroundColor: '#F7F8FA',
	},
	backButton: {
		marginRight: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1E2532',
		textAlign: 'left',

	},
	tabs: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 20,
		gap: 16,
	},
	tab: {
		backgroundColor: '#E5EAF0',
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 6,
	},
	tabActive: {
		backgroundColor: '#4576F2',
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 6,
	},
	tabText: {
		color: '#4A5463',
		fontWeight: '500',
		fontSize: 13,
	},
	tabTextActive: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 13,
	},
});
