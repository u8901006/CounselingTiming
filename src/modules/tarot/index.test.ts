import { describe, it, expect, vi } from 'vitest'
import { 
  drawCards, 
  interpretReading, 
  fetchAllCards, 
  getTimingScoreFromTarot,
  SPREADS
} from './index'
import type { DrawnCard, SpreadType, TarotCard } from './index'

const TEST_TAROT_CARDS: TarotCard[] = [
  { name: 'The Fool', nameShort: 'fool', value: '0', valueInt: 0, suit: 'major', type: 'major', meaningUp: 'New beginnings, innocence, spontaneity, a free spirit', meaningRev: 'Recklessness, risk-taking, inconsideration, naivety', description: 'The Fool represents new beginnings and innocence.' },
  { name: 'The Magician', nameShort: 'magician', value: '1', valueInt: 1, suit: 'major', type: 'major', meaningUp: 'Manifestation, resourcefulness, power, inspired action', meaningRev: 'Manipulation, poor planning, untapped talents', description: 'The Magician represents manifestation and resourcefulness.' },
  { name: 'The High Priestess', nameShort: 'priestess', value: '2', valueInt: 2, suit: 'major', type: 'major', meaningUp: 'Intuition, sacred knowledge, divine feminine, the subconscious mind', meaningRev: 'Secrets, disconnection from intuition, withdrawal', description: 'The High Priestess represents intuition and sacred knowledge.' },
  { name: 'The Empress', nameShort: 'empress', value: '3', valueInt: 3, suit: 'major', type: 'major', meaningUp: 'Femininity, beauty, nature, nurturing, abundance', meaningRev: 'Creative block, dependence on others', description: 'The Empress represents femininity and nurturing.' },
  { name: 'The Emperor', nameShort: 'emperor', value: '4', valueInt: 4, suit: 'major', type: 'major', meaningUp: 'Authority, establishment, structure, a father figure', meaningRev: 'Tyranny, rigidity, coldness', description: 'The Emperor represents authority and structure.' },
  { name: 'The Hierophant', nameShort: 'hierophant', value: '5', valueInt: 5, suit: 'major', type: 'major', meaningUp: 'Spiritual wisdom, religious beliefs, conformity, tradition', meaningRev: 'Personal beliefs, freedom, challenging convention', description: 'The Hierophant represents spiritual wisdom.' },
  { name: 'The Lovers', nameShort: 'lovers', value: '6', valueInt: 6, suit: 'major', type: 'major', meaningUp: 'Love, harmony, relationships, values alignment, choices', meaningRev: 'Self-love, disharmony, imbalance, misalignment', description: 'The Lovers represents love and relationships.' },
  { name: 'The Chariot', nameShort: 'chariot', value: '7', valueInt: 7, suit: 'major', type: 'major', meaningUp: 'Control, willpower, success, action, determination', meaningRev: 'Self-discipline, opposition, lack of direction', description: 'The Chariot represents control and determination.' },
  { name: 'Strength', nameShort: 'strength', value: '8', valueInt: 8, suit: 'major', type: 'major', meaningUp: 'Strength, courage, persuasion, influence, compassion', meaningRev: 'Inner strength, self-doubt, raw emotion', description: 'Strength represents courage and compassion.' },
  { name: 'The Hermit', nameShort: 'hermit', value: '9', valueInt: 9, suit: 'major', type: 'major', meaningUp: 'Soul-searching, introspection, being alone, inner guidance', meaningRev: 'Isolation, loneliness, withdrawal', description: 'The Hermit represents introspection and inner guidance.' },
  { name: 'Wheel of Fortune', nameShort: 'fortune', value: '10', valueInt: 10, suit: 'major', type: 'major', meaningUp: 'Good luck, karma, life cycles, destiny, a turning point', meaningRev: 'Bad luck, resistance to change, breaking cycles', description: 'Wheel of Fortune represents life cycles and destiny.' },
  { name: 'Justice', nameShort: 'justice', value: '11', valueInt: 11, suit: 'major', type: 'major', meaningUp: 'Justice, fairness, truth, cause and effect, law', meaningRev: 'Unfairness, lack of accountability, dishonesty', description: 'Justice represents fairness and truth.' },
  { name: 'The Hanged Man', nameShort: 'hangedman', value: '12', valueInt: 12, suit: 'major', type: 'major', meaningUp: 'Pause, surrender, letting go, new perspectives', meaningRev: 'Stalling, resistance, indecision', description: 'The Hanged Man represents surrender and new perspectives.' },
  { name: 'Death', nameShort: 'death', value: '13', valueInt: 13, suit: 'major', type: 'major', meaningUp: 'Endings, change, transformation, transition', meaningRev: 'Resistance to change, personal transformation, inner purging', description: 'Death represents transformation and endings.' },
  { name: 'Temperance', nameShort: 'temperance', value: '14', valueInt: 14, suit: 'major', type: 'major', meaningUp: 'Balance, moderation, patience, purpose', meaningRev: 'Imbalance, excess, self-healing, realignment', description: 'Temperance represents balance and moderation.' },
  { name: 'The Devil', nameShort: 'devil', value: '15', valueInt: 15, suit: 'major', type: 'major', meaningUp: 'Shadow self, attachment, addiction, restriction', meaningRev: 'Releasing limiting beliefs, exploring dark thoughts', description: 'The Devil represents attachment and restriction.' },
  { name: 'The Tower', nameShort: 'tower', value: '16', valueInt: 16, suit: 'major', type: 'major', meaningUp: 'Sudden change, upheaval, chaos, revelation, awakening', meaningRev: 'Personal transformation, fear of change, averting disaster', description: 'The Tower represents sudden change and upheaval.' },
  { name: 'The Star', nameShort: 'star', value: '17', valueInt: 17, suit: 'major', type: 'major', meaningUp: 'Hope, faith, purpose, renewal, spirituality', meaningRev: 'Lack of faith, despair, self-trust, disconnection', description: 'The Star represents hope and renewal.' },
  { name: 'The Moon', nameShort: 'moon', value: '18', valueInt: 18, suit: 'major', type: 'major', meaningUp: 'Illusion, fear, anxiety, subconscious, intuition', meaningRev: 'Release of fear, repressed emotions, inner confusion', description: 'The Moon represents illusion and intuition.' },
  { name: 'The Sun', nameShort: 'sun', value: '19', valueInt: 19, suit: 'major', type: 'major', meaningUp: 'Positivity, fun, warmth, success, vitality', meaningRev: 'Inner child, feeling down, overly optimistic', description: 'The Sun represents positivity and success.' },
  { name: 'Judgement', nameShort: 'judgement', value: '20', valueInt: 20, suit: 'major', type: 'major', meaningUp: 'Judgement, rebirth, inner calling, absolution', meaningRev: 'Self-doubt, refusing self-examination', description: 'Judgement represents rebirth and inner calling.' },
  { name: 'The World', nameShort: 'world', value: '21', valueInt: 21, suit: 'major', type: 'major', meaningUp: 'Completion, integration, accomplishment, travel', meaningRev: 'Seeking personal closure, short-cuts, delays', description: 'The World represents completion and accomplishment.' },
]

describe('drawCards', () => {
  it('should return correct number of cards for single spread', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 1)
    expect(drawn).toHaveLength(1)
  })

  it('should return correct number of cards for three spread', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 3)
    expect(drawn).toHaveLength(3)
  })

  it('should return correct number of cards for celtic spread', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 10)
    expect(drawn).toHaveLength(10)
  })

  it('should assign position meanings correctly', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 3)
    drawn.forEach((card, index) => {
      expect(card.position).toBe(SPREADS.three.positions[index])
      expect(card.positionMeaning).toBe(SPREADS.three.positionMeanings[index])
    })
  })

  it('should set isReversed to boolean', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 3)
    drawn.forEach(card => {
      expect(typeof card.isReversed).toBe('boolean')
    })
  })

  it('should handle insufficient cards gracefully', () => {
    const smallDeck: TarotCard[] = [TEST_TAROT_CARDS[0], TEST_TAROT_CARDS[1]]
    const drawn = drawCards(smallDeck, 5)
    expect(drawn.length).toBeLessThanOrEqual(2)
  })
})

describe('interpretReading', () => {
  const mockDrawnCards: DrawnCard[] = [
    {
      card: TEST_TAROT_CARDS[0],
      isReversed: false,
      position: '過去',
      positionMeaning: '影響當前狀況的過去因素',
    },
    {
      card: TEST_TAROT_CARDS[1],
      isReversed: true,
      position: '現在',
      positionMeaning: '目前的狀態',
    },
    {
      card: TEST_TAROT_CARDS[2],
      isReversed: false,
      position: '未來',
      positionMeaning: '可能的發展方向',
    },
  ]

  it('should return reading with summary', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.summary).toBeDefined()
    expect(reading.summary.length).toBeGreaterThan(0)
  })

  it('should include card positions in summary', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.summary).toContain('過去')
    expect(reading.summary).toContain('現在')
    expect(reading.summary).toContain('未來')
  })

  it('should analyze psychological state', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.psychologicalState).toBeDefined()
    expect(typeof reading.psychologicalState.stressLevel).toBe('number')
    expect(typeof reading.psychologicalState.hopeLevel).toBe('number')
    expect(typeof reading.psychologicalState.needForSupport).toBe('number')
    expect(typeof reading.psychologicalState.emotionalState).toBe('string')
  })

  it('should generate counseling advice', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.counselingAdvice).toBeDefined()
    expect(reading.counselingAdvice.length).toBeGreaterThan(0)
  })

  it('should return correct spread type', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.spread).toBe('three')
  })

  it('should mark reversed cards correctly in summary', () => {
    const reading = interpretReading(mockDrawnCards, 'three')
    expect(reading.summary).toContain('逆位')
  })
})

describe('fetchAllCards', () => {
  it('should return fallback cards when API fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))
    
    const cards = await fetchAllCards()
    expect(cards).toBeDefined()
    expect(cards.length).toBeGreaterThan(0)
    expect(cards[0]).toHaveProperty('name')
    expect(cards[0]).toHaveProperty('meaningUp')
    expect(cards[0]).toHaveProperty('meaningRev')
  })
})

describe('getTimingScoreFromTarot', () => {
  it('should return score between 0 and 100', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 3)
    const reading = interpretReading(drawn, 'three')
    const timing = getTimingScoreFromTarot(reading)
    
    expect(timing.score).toBeGreaterThanOrEqual(0)
    expect(timing.score).toBeLessThanOrEqual(100)
  })

  it('should return factors array', () => {
    const drawn = drawCards(TEST_TAROT_CARDS, 3)
    const reading = interpretReading(drawn, 'three')
    const timing = getTimingScoreFromTarot(reading)
    
    expect(Array.isArray(timing.factors)).toBe(true)
  })

  it('should increase score with stress cards', () => {
    const stressCard = TEST_TAROT_CARDS.find(c => c.name === 'The Tower')
    const mockDrawn: DrawnCard[] = [{
      card: stressCard!,
      isReversed: false,
      position: '現狀',
      positionMeaning: '你目前的狀態',
    }]
    const reading = interpretReading(mockDrawn, 'single')
    const timing = getTimingScoreFromTarot(reading)
    
    expect(timing.score).toBeGreaterThan(50)
    expect(timing.factors.length).toBeGreaterThan(0)
  })
})

describe('SPREADS', () => {
  it('should have single spread definition', () => {
    expect(SPREADS.single.cardCount).toBe(1)
    expect(SPREADS.single.positions).toHaveLength(1)
  })

  it('should have three spread definition', () => {
    expect(SPREADS.three.cardCount).toBe(3)
    expect(SPREADS.three.positions).toHaveLength(3)
  })

  it('should have celtic spread definition', () => {
    expect(SPREADS.celtic.cardCount).toBe(10)
    expect(SPREADS.celtic.positions).toHaveLength(10)
  })
})
