"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { AVAILABLE_SOUNDS, SoundCategory, SoundOption, useMixStore } from "@/store/useMixStore";
import {
    Window,
    WindowHeader,
    WindowContent,
    Button,
    Tabs,
    Tab,
    TabBody,
    GroupBox,
    Cutout,
} from "react95";

interface TrackSelectorProps {
    isOpen: boolean;
    trackId: number | null;
    onClose: () => void;
    onSelect: (trackId: number, sound: SoundOption) => void;
}

const StyledListItem = styled.div<{ $selected?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px;
  background: ${({ $selected }) => ($selected ? "#000080" : "transparent")};
  color: ${({ $selected }) => ($selected ? "white" : "black")};

  &:hover {
    background: ${({ $selected }) => ($selected ? "#000080" : "#000080")};
    color: white;
  }
`;

export const TrackSelector: React.FC<TrackSelectorProps> = ({
    isOpen,
    trackId,
    onClose,
    onSelect,
}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const tracks = useMixStore((state) => state.tracks);
    const currentTrack = trackId !== null ? tracks[trackId] : null;

    if (!isOpen) return null;

    const categories: SoundCategory[] = ['nature', 'white-noise', 'ambient'];
    const activeCategory = categories[activeTab];
    const filteredSounds = AVAILABLE_SOUNDS.filter(s => s.category === activeCategory);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Window style={{ width: 400, maxWidth: '95%', boxShadow: 'none' }} className="window">
                <WindowHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/mmsys_103-0.png" style={{ height: 16 }} alt="" />
                        <span>Select Sound.exe</span>
                    </div>
                    <Button onClick={onClose} size="sm" square>
                        <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>x</span>
                    </Button>
                </WindowHeader>
                <WindowContent>
                    <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
                        <Tab value={0}>Nature</Tab>
                        <Tab value={1}>Noises</Tab>
                        <Tab value={2}>Ambient</Tab>
                    </Tabs>
                    <TabBody style={{ height: 320 }}>
                        <GroupBox label="Select a Sound" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Cutout style={{ flex: 1, overflowY: 'auto', background: 'white', padding: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filteredSounds.map((sound) => (
                                        <StyledListItem
                                            key={sound.id}
                                            onClick={() => trackId !== null && onSelect(trackId, sound)}
                                            $selected={currentTrack?.sampleUrl === sound.url}
                                        >
                                            <img
                                                src={
                                                    currentTrack?.sampleUrl === sound.url
                                                        ? "https://win98icons.alexmeub.com/icons/png/cd_audio_cd-0.png"
                                                        : "https://win98icons.alexmeub.com/icons/png/cd_audio_cd-1.png"
                                                }
                                                style={{ width: 16, height: 16 }}
                                                alt=""
                                            />
                                            <span style={{ fontFamily: 'ms_sans_serif' }}>{sound.name}</span>
                                        </StyledListItem>
                                    ))}
                                </div>
                            </Cutout>
                        </GroupBox>
                    </TabBody>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <Button onClick={onClose}>Cancel</Button>
                    </div>
                </WindowContent>
            </Window>
        </div>
    );
};
