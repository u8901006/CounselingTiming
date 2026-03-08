import { describe, it, expect, beforeEach } from 'vitest';
import { useUserDataStore } from './userDataStore';

describe('userDataStore', () => {
  beforeEach(() => {
    useUserDataStore.getState().clearData();
  });

  it('should have null data initially', () => {
    expect(useUserDataStore.getState().data).toBeNull();
  });

  it('should set and get user data', () => {
    const testData = {
      name: 'Test',
      gender: 'male' as const,
      birthDate: new Date('1990-01-15'),
      birthTime: { hour: 10, minute: 30 },
      location: { city: 'Taipei', lat: 25.0330, lng: 121.5654 }
    };
    
    useUserDataStore.getState().setData(testData);
    
    expect(useUserDataStore.getState().data).toEqual(testData);
  });

  it('should clear data', () => {
    const testData = {
      name: 'Test',
      gender: 'male' as const,
      birthDate: new Date('1990-01-15'),
      birthTime: { hour: 10, minute: 30 },
      location: { city: 'Taipei', lat: 25.0330, lng: 121.5654 }
    };
    
    useUserDataStore.getState().setData(testData);
    useUserDataStore.getState().clearData();
    
    expect(useUserDataStore.getState().data).toBeNull();
  });
});
