import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Notification, notificationService } from './NotificationService';

const NotificationItem = ({ item }: { item: Notification }) => {
  if (item.type === 'consulta') {
    return (
      <View style={styles.itemContainer}>
        <Image source={require('@/assets/images/informacoes.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.titleBold}>{item.title}</Text>
          <Text style={styles.description}><Text style={styles.bold}>A consulta com a Dra. Maria Glenda</Text> irá iniciar hoje às...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.itemContainer}>
      {item.user?.avatar && <Image source={item.user.avatar} style={styles.avatar} />}
      <View style={styles.textContainer}>
        <Text style={styles.titleBold}>{item.user?.name} <Text style={styles.normal}>{item.message}</Text></Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {item.post && (
        <Image source={item.post.image} style={styles.postImage} />
      )}
      {item.canFollowBack && (
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Seguir</Text></TouchableOpacity>
      )}
      {item.canRemove && (
        <TouchableOpacity style={styles.removeButton}><Text style={styles.removeText}>Excluir</Text></TouchableOpacity>
      )}
    </View>
  );
};

export const NotificationsList = () => {
  const [selectedType, setSelectedType] = useState<'todas'|'curtiu'|'seguiu'|'comentario'|'mencionado'|'consulta'>('todas');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Carregar notificações do serviço
    setNotifications(notificationService.getNotifications());
  }, []);

  const filterOptions = [
    { key: 'todas', label: 'Todas' },
    { key: 'curtiu', label: 'Curtidas' },
    { key: 'consulta', label: 'Agendamentos' },
    { key: 'comentario', label: 'Comentários' },
    { key: 'mencionado', label: 'Mencionados' },
    { key: 'seguiu', label: 'Seguiu' },
  ];

  const filteredNotifications = selectedType === 'todas'
    ? notifications
    : notifications.filter(n => n.type === selectedType);

  // Separar notificações por período - não lidas são "hoje", lidas são "semana passada"
  const notificationsToday = filteredNotifications.filter(n => !n.isRead);
  const notificationsWeek = filteredNotifications.filter(n => n.isRead);

  return (
    <View style={styles.container}>
      <FlatList
        data={filterOptions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.carousel}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={selectedType === item.key ? styles.tabActive : styles.tab}
            onPress={() => setSelectedType(item.key as any)}
          >
            <Text style={selectedType === item.key ? styles.tabTextActive : styles.tabText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {notificationsToday.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Hoje</Text>
            {notificationsToday.map(item => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </>
        )}
        {notificationsWeek.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>7 dias</Text>
            {notificationsWeek.map(item => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    backgroundColor: '#E5EAF0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#4576F2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#4A5463',
    textAlign: 'center',
    includeFontPadding: false,
  },
  tabTextActive: {
    fontWeight: '500',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    includeFontPadding: false,
  },
  carousel: {
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#F7F8FA',
    
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E2532',
    marginTop: 24,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F7F8FA',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginLeft: 8,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleBold: {
    fontSize: 13,
    color: '#1E2532',
    fontWeight: '700',
  },
  bold: {
    fontWeight: '700',
    color: '#1E2532',
  },
  normal: {
    fontWeight: '400',
    color: '#1E2532',
  },
  description: {
    fontSize: 12,
    color: '#4A5463',
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: '#A0A4AE',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#4576F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: '#E5EAF0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  removeText: {
    color: '#4576F2',
    fontWeight: '600',
    fontSize: 12,
  },
});
