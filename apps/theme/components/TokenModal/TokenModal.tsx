/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Button,
  Heading,
  Modal,
  Tabs,
  Tooltip,
} from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { CodeSnippet } from '../CodeSnippet/CodeSnippet';
import type { modeType } from '../../types';
import type { ColorInfoType, ColorType } from '../../utils/themeUtils';
import { generateScaleForColor } from '../../utils/themeUtils';
import { Settings } from '../../settings';

import classes from './TokenModal.module.css';

type TokenModalProps = {
  accentColor: CssColor;
  neutralColor: CssColor;
  brand1Color: CssColor;
  brand2Color: CssColor;
  brand3Color: CssColor;
};

export const TokenModal = ({
  accentColor,
  neutralColor,
  brand1Color,
  brand2Color,
  brand3Color,
}: TokenModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [JSONTheme, setJSONTheme] = useState('');
  const [css, setCss] = useState(
    ':root { --color-1: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; }',
  );
  const [toolTipText, setToolTipText] = useState('Kopier nettaddresse');

  const generateJsonForColor = (colorArray: ColorInfoType[]) => {
    const obj: { [key: string]: { value: string; type: string } } = {};
    for (let i = 0; i < colorArray.length; i++) {
      if (i === 13 && colorArray.length >= 14) {
        obj['contrast-1'] = {
          value: colorArray[i].hexColor,
          type: 'color',
        };
      } else if (i === 14 && colorArray.length >= 15) {
        obj['contrast-2'] = {
          value: colorArray[i].hexColor,
          type: 'color',
        };
      } else {
        obj[i + 1] = { value: colorArray[i].hexColor, type: 'color' };
      }
    }
    return obj;
  };

  const genereateGlobalsJson = (theme: modeType) => {
    const blueScale = generateScaleForColor(Settings.blueBaseColor, theme);
    const greenScale = generateScaleForColor(Settings.greenBaseColor, theme);
    const orangeScale = generateScaleForColor(Settings.orangeBaseColor, theme);
    const purpleScale = generateScaleForColor(Settings.purpleBaseColor, theme);
    const redScale = generateScaleForColor(Settings.redBaseColor, theme);
    const yellowScale = generateScaleForColor(Settings.yellowBaseColor, theme);

    const obj = {
      global: {
        blue: generateJsonForColor(blueScale),
        green: generateJsonForColor(greenScale),
        orange: generateJsonForColor(orangeScale),
        purple: generateJsonForColor(purpleScale),
        red: generateJsonForColor(redScale),
        yellow: generateJsonForColor(yellowScale),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    setJSONTheme(json);
  };

  const generateThemeJson = (theme: modeType) => {
    const accentColors = generateScaleForColor(accentColor, theme);
    const neutralColors = generateScaleForColor(neutralColor, theme);
    const brand1Colors = generateScaleForColor(brand1Color, theme);
    const brand2Colors = generateScaleForColor(brand2Color, theme);
    const brand3Colors = generateScaleForColor(brand3Color, theme);

    const obj = {
      theme: {
        accent: generateJsonForColor(accentColors),
        neutral: generateJsonForColor(neutralColors),
        brand1: generateJsonForColor(brand1Colors),
        brand2: generateJsonForColor(brand2Colors),
        brand3: generateJsonForColor(brand3Colors),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    setJSONTheme(json);
  };

  const generateCSSVars = (theme: modeType) => {
    const accentColors = generateScaleForColor(accentColor, theme);
    const neutralColors = generateScaleForColor(neutralColor, theme);
    const brand1Colors = generateScaleForColor(brand1Color, theme);
    const brand2Colors = generateScaleForColor(brand2Color, theme);
    const brand3Colors = generateScaleForColor(brand3Color, theme);

    const obj = {
      theme: {
        accent: generateJsonForColor(accentColors),
        neutral: generateJsonForColor(neutralColors),
        brand1: generateJsonForColor(brand1Colors),
        brand2: generateJsonForColor(brand2Colors),
        brand3: generateJsonForColor(brand3Colors),
      },
    };

    let CSS = '';

    if (theme === 'light') {
      CSS = ':root, [data-ds-theme="light"] {';
    } else if (theme === 'dark') {
      CSS = '[data-ds-theme="dark"] {';
    } else {
      CSS = '[data-ds-theme="contrast"] {';
    }

    for (const key in obj.theme) {
      for (const color in obj.theme[key as ColorType]) {
        CSS += `--ds-color-${key}-${color}: ${obj.theme[key as ColorType][color].value};`;
      }
    }
    CSS += '}';
    return CSS;
  };

  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(window.location.href).catch((reason) => {
      throw Error(String(reason));
    });
  };

  useEffect(() => {
    generateThemeJson('light');
    const lightCSS = generateCSSVars('light');
    const darkCSS = generateCSSVars('dark');
    const contrastCSS = generateCSSVars('contrast');
    setCss(lightCSS + darkCSS + contrastCSS);
  }, []);

  return (
    <Modal.Root>
      <Modal.Trigger
        onClick={() => {
          generateThemeJson('light');
          const lightCSS = generateCSSVars('light');
          const darkCSS = generateCSSVars('dark');
          const contrastCSS = generateCSSVars('contrast');
          setCss(lightCSS + darkCSS + contrastCSS);
          return modalRef.current?.showModal();
        }}
      >
        Kopier tema
      </Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
        style={{
          maxWidth: '1400px',
        }}
        className={classes.modal}
      >
        <Modal.Header className={classes.modalHeader}>
          <img
            src='img/emblem.svg'
            alt='ff'
            className={classes.emblem}
          />
          <span className={classes.headerText}>Kopier fargetema</span>
          <Tooltip
            content={toolTipText}
            portal={false}
          >
            <Button
              className={classes.shareBtn}
              variant='tertiary'
              color='neutral'
              size='sm'
              onClick={() => onButtonClick()}
              onMouseEnter={() => setToolTipText('Kopier nettadresse')}
            >
              Del
              <ArrowForwardIcon
                title='a11y-title'
                fontSize='1.5rem'
              />
            </Button>
          </Tooltip>
        </Modal.Header>
        <Modal.Content className={classes.modalContent}>
          <div className={classes.content}>
            <div className={classes.column}>
              <Heading
                className={classes.title}
                size='xs'
              >
                Json til Figma
              </Heading>
              <div className={classes.tabs}>
                <Tabs
                  defaultValue='value1'
                  size='sm'
                >
                  <Tabs.List>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('light')}
                      value='value1'
                    >
                      Light
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('dark')}
                      value='value2'
                    >
                      Dark
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('contrast')}
                      value='value3'
                    >
                      Contrast
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('light')}
                      value='value4'
                    >
                      G: Light
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('dark')}
                      value='value5'
                    >
                      G: Dark
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('contrast')}
                      value='value6'
                    >
                      G: Contrast
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </div>
              <div className={classes.snippet}>
                <CodeSnippet language='css'>{JSONTheme}</CodeSnippet>
              </div>
            </div>
            <div className={classes.column}>
              <Heading
                className={classes.title}
                size='xs'
              >
                CSS variabler
              </Heading>

              <div className={classes.snippet}>
                <CodeSnippet language='css'>{css}</CodeSnippet>
              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};