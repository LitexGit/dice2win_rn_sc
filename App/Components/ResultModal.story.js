import React from 'react'
import { storiesOf } from '@storybook/react-native'

import ResultModal from './ResultModal'

storiesOf('ResultModal')
  .add('PUT', () => (
    <ResultModal
        show={true}
        status='put'
    />
  ))
  .add('DRAW', () => (
    <ResultModal
        show={true}
        status='draw'
    />
  ))
  .add('WIN', () => (
    <ResultModal
        show={true}
        status='win'
        result={{amount: 1.9645321}}
    />
  ))
  .add('LOSE', () => (
    <ResultModal
        show={true}
        status='lose'
    />
  ))
  .add('CLOSE', () => (
    <ResultModal
        show={false}
        status='lose'
    />
  ))