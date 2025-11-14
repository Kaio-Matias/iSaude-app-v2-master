import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PulseData } from './PulseData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PulseCardProps {
  pulse: PulseData;
  isActive: boolean;
  onLike: (pulseId: string) => void;
  onComment: (pulseId: string) => void;
  onShare: (pulseId: string) => void;
  onFollow: (authorId: string) => void;
}

export default function PulseCard({
  pulse,
  isActive,
  onLike,
  onComment,
  onShare,
  onFollow
}: PulseCardProps) {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    } else {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const shouldShowReadMore = pulse.content.description.length > 100;

  return (
    <View style={styles.container}>
      {/* Background Video/Image */}
      <TouchableOpacity 
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handlePlayPause}
      >
        <Image
          source={{ uri: pulse.video.thumbnail }}
          style={styles.videoPlayer}
          resizeMode="cover"
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <MaterialIcons name="play-arrow" size={80} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Gradient overlay for better text visibility */}
      <View style={styles.gradientOverlay} />

      {/* Content Overlay */}
      <View style={styles.overlay}>
        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Left side - User info and content */}
          <View style={styles.leftContent}>
            {/* Author Info */}
            <View style={styles.authorSection}>
              <Image 
                source={{ uri: pulse.author.avatar }} 
                style={styles.authorAvatar} 
              />
              <View style={styles.authorInfo}>
                <View style={styles.authorNameRow}>
                  <Text style={styles.authorName}>{pulse.author.name}</Text>
                  {pulse.author.isVerified && (
                    <MaterialIcons name="verified" size={16} color="#4576F2" />
                  )}
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      pulse.author.isFollowing && styles.followingButton
                    ]}
                    onPress={() => onFollow(pulse.author.id)}
                  >
                    <Text style={[
                      styles.followButtonText,
                      pulse.author.isFollowing && styles.followingButtonText
                    ]}>
                      {pulse.author.isFollowing ? 'Seguindo' : 'Seguir'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {pulse.author.specialty && (
                  <Text style={styles.authorSpecialty}>• {pulse.author.specialty}</Text>
                )}
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                {showFullDescription || !shouldShowReadMore 
                  ? pulse.content.description 
                  : truncateText(pulse.content.description, 100) + '...'}
              </Text>
              
              {shouldShowReadMore && (
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text style={styles.readMoreText}>
                    {showFullDescription ? 'Ver menos' : 'Ver mais'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Likes */}
            <View style={styles.likesSection}>
              <Text style={styles.likesText}>
                {formatNumber(pulse.interactions.likes.count)} curtidas
              </Text>
            </View>

            {/* Audio and Tagged People */}
            <View style={styles.bottomInfo}>
              <View style={styles.audioInfoContainer}>
                <MaterialIcons name="music-note" size={14} color="white" />
                <Text style={styles.audioText}>
                  {pulse.audio?.name || 'Som original'}
                </Text>
              </View>
              
              {pulse.taggedPeople.count > 0 && (
                <View style={styles.taggedPeopleContainer}>
                  <MaterialIcons name="person" size={14} color="white" />
                  <Text style={styles.taggedText}>
                    {pulse.taggedPeople.count} Pessoa{pulse.taggedPeople.count > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Right side - Action buttons */}
          <View style={styles.rightActions}>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  pulse.interactions.likes.isLiked && styles.likedButton
                ]}
                onPress={() => onLike(pulse.id)}
              >
                <MaterialIcons
                  name={pulse.interactions.likes.isLiked ? "favorite" : "favorite-border"}
                  size={28}
                  color={pulse.interactions.likes.isLiked ? "white" : "#333"}
                />
              </TouchableOpacity>
              <Text style={styles.actionText}>
                {formatNumber(pulse.interactions.likes.count)}
              </Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onComment(pulse.id)}
              >
                <MaterialIcons name="comment" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.actionText}>
                {formatNumber(pulse.interactions.comments.count)}
              </Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onShare(pulse.id)}
              >
                <Ionicons name="share-outline" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.actionText}>
                {formatNumber(pulse.interactions.shares.count)}
              </Text>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 40,
    width: 80,
    height: 80,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  bottomContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  authorSpecialty: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  followButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 4,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  followingButtonText: {
    color: 'rgba(255,255,255,0.8)',
  },
  descriptionSection: {
    marginBottom: 12,
  },
  description: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  readMoreText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  likesSection: {
    marginBottom: 8,
  },
  likesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  audioInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  audioText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  taggedPeopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  taggedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  rightActions: {
    alignItems: 'center',
  },
  actionButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: 48,
    height: 48,
    justifyContent: 'center',
    marginBottom: 6,
  },
  likedButton: {
    backgroundColor: '#FF6B6B',
  },
  moreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
});