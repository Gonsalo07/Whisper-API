import { CONFIG } from 'src/config-global';

import { AliasView } from '../sections/alias/view/alias-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Alias Públicos - ${CONFIG.appName}`}</title>

      <AliasView />
    </>
  );
}