
import React, { createContext, useContext, useState, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

interface TabBarVisibilityContextType {
  scrollY: number;
  setScrollY: (y: number) => void;
  tabBarTranslateY: any;
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined);

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollYState] = useState(0);
  const lastScrollY = useRef(0);
  const tabBarTranslateY = useSharedValue(0);

  const setScrollY = (y: number) => {
    const diff = y - lastScrollY.current;
    
    // Only hide/show if scrolling more than 5 pixels
    if (Math.abs(diff) > 5) {
      if (diff > 0 && y > 50) {
        // Scrolling down - hide tab bar
        tabBarTranslateY.value = 100;
      } else if (diff < 0) {
        // Scrolling up - show tab bar
        tabBarTranslateY.value = 0;
      }
      
      lastScrollY.current = y;
    }
    
    setScrollYState(y);
  };

  return (
    <TabBarVisibilityContext.Provider value={{ scrollY, setScrollY, tabBarTranslateY }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const context = useContext(TabBarVisibilityContext);
  if (context === undefined) {
    throw new Error('useTabBarVisibility must be used within a TabBarVisibilityProvider');
  }
  return context;
}
