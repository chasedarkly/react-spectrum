/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaTabProps} from '@react-types/tabs';
import {DOMAttributes, FocusableElement} from '@react-types/shared';
import {generateId} from './utils';
import {RefObject} from 'react';
import {TabListState} from '@react-stately/tabs';
import {useSelectableItem} from '@react-aria/selection';

export interface TabAria {
  /** Props for the tab element. */
  tabProps: DOMAttributes,
  /** Whether the tab is currently selected. */
  isSelected: boolean,
  /** Whether the tab is disabled. */
  isDisabled: boolean,
  /** Whether the tab is currently in a pressed state. */
  isPressed: boolean
}

/**
 * Provides the behavior and accessibility implementation for a tab.
 * When selected, the associated tab panel is shown.
 */
export function useTab<T>(
  props: AriaTabProps,
  state: TabListState<T>,
  ref: RefObject<FocusableElement>
): TabAria {
  let {key, isDisabled: propsDisabled} = props;
  let {selectionManager: manager, selectedKey} = state;

  let isSelected = key === selectedKey;

  let isDisabled = propsDisabled || state.isDisabled || state.disabledKeys.has(key);
  let {itemProps, isPressed} = useSelectableItem({
    selectionManager: manager,
    key,
    ref,
    isDisabled
  });

  let tabId = generateId(state, key, 'tab');
  let tabPanelId = generateId(state, key, 'tabpanel');
  let {tabIndex} = itemProps;

  return {
    tabProps: {
      ...itemProps,
      id: tabId,
      'aria-selected': isSelected,
      'aria-disabled': isDisabled || undefined,
      'aria-controls': isSelected ? tabPanelId : undefined,
      tabIndex: isDisabled ? undefined : tabIndex,
      role: 'tab'
    },
    isSelected,
    isDisabled,
    isPressed
  };
}

