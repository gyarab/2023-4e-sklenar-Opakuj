<template>
  <v-list>
    <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Formát psaní otázek" subtitle="">
        </v-list-item>
      </template>
      <v-list-item>
        <v-textarea
          variant="outlined"
          model-value="Tato webová aplikace umožňuje napsat opakovací cvičení pro studenta/ku v různých formách. 
                    Cvičení lze vytvářet ve formátu textového dokumentu(.txt) a nebo ve webovém rozhraní. 
                    Pro jednodušší orientaci je však doporučováno právě webové rozhraní.
                    Pokud se rozhodnete vytvářet cvičení ve formátu textového dokumentu, je důležité dodržet následující pravidla a formát:

                    - Každá otázka musí být na samostatném řádku
                    - Otázka musí být následována správnou odpovědí také na samostatném řádku (forma zápisu správné odpovědi je popsána níže v kapitole Typy otázek)
                    - Otázka musí být oddělena od odstatních otázek pomocí prázdného řádku
                    - Každý textový soubor, který obsahuje cvičení musí mít na úplně prvním řádku napsáno jméno cvičení nebo maturitního tématu
                    - Uživatel si také musí dát pozor, aby konec souboru neobsahoval žádné prázdné řádky, jinak mu nebude možné soubor nahrát

                    Také je zde možnost zakomentovat určité části textového souboru ohraničené pomocí znaku { a }. Toto je však silně nedoporčováno, jelikož to může způsobit chyby při nahrávání cvičení.
                    Formát psaní otázek je tedy následující:
                        #NázevCvičení
                        CisloOtazky.Otazka
                        Typ-$,%,&,*
                        FormátOtázkyJeVKapitelNíže
                "
          auto-grow
          readonly
        >
        </v-textarea>
      </v-list-item>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Typy otázek"></v-list-item>
      </template>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Doplnění do textu - symbol $"
          ></v-list-item>
        </template>
        <v-textarea
          variant="outlined"
          model-value="
        Text do kterého se mají doplňovat slova musí začínat a končit znakem /
        V textu se slova, která se mají doplnit, označují pomocí znaku ! a za ním je číslo, které určuje pořadí odpovědi o řádek níže
        Poslední řádek musí začínat znakem [ a končit znakem ], mezi tyto znaky se píší správné odpovědi oddělené středníkem
        V tomto případě je vcelku jedno, jak se otázka bude jmenovat, ale je důležité, aby se dodrželo číslování otázek

        Příklad:
        /Text s chybějícími slovy !1, !2 a !3 .../
        [správnáOdpověd1;správnáOdpověd2;správnáOdpověd3,...]

        "
          auto-grow
          readonly
        >
        </v-textarea>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Napsat správnou odpověď - symbol %"
          ></v-list-item>
        </template>
        <v-textarea
          variant="outlined"
          model-value="
        Zde stačí napsat správnou odpověď za znak /

        Příklad:
        /správná odpověd

        "
          auto-grow
          readonly
        >
        </v-textarea>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Spojování dvojic - symbol &"
          ></v-list-item>
        </template>
        <v-textarea
          variant="outlined"
          model-value="
        V tomto případě se spojují dvojice slov, ty jsou vždy na samostatném řádku, ohraničeny znaky [ a ] a odděleny středníkem

        Příklad:
        [prvniZDvojice;druhaZDvojice]
	    [prvniZDvojice;druhaZDvojice]
        ...

        "
          auto-grow
          readonly
        >
        </v-textarea>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Vybrat správné odpovědi - symbol *"
          ></v-list-item>
        </template>
        <v-textarea
          variant="outlined"
          model-value="
        Zde je úkol vybrat správné odpovědi ze seznamu možných odpovědí(správné i špatné)
            [správnáOdpověď1,správnáOdpověď2,správnáOdpověď3,...]
            !špatnáOdpověď1;špatnáOdpověď2;špatnáOdpověď3;...!
        "
          auto-grow
          readonly
        >
        </v-textarea>
      </v-list-group>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Názorné ukázky"></v-list-item>
      </template>
      <v-textarea
        variant="outlined"
        model-value="
        #Test
        1.PrvniOtazka
        Typ-$
        /Testuju uwu nejlepsi je !1 ano ze ano
        [UwUntu]

        2.DruhaOtazka
        Typ-%
        /odpoved

        3.TretiOtazka
        Typ-&
        [prvni;druha]
        [treti;ctvrta]
        [pata;sesta]

        4.CtvrtaOtazka
        Typ-*
        [prvni;druha]
        !treti;ctvrta!
      "
        auto-grow
        readonly
      >
      </v-textarea>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          title="Kde lze nahrát hotová cvičení"
        ></v-list-item>
      </template>
      <v-textarea
        variant="outlined"
        model-value="
      Hotová cvičení lze nahrát na stránce s cvičeními přes zelené tlačítko s s bílým znaménkem plus viz. obrázek níže.
      Pokud bylo cvičení vytvořeno ve webovém rozhraní, tak se nahraje samo po zmáčknutí tlačítka Hotovo. 
      "
        auto-grow
        readonly
      >
      </v-textarea>
      <v-img></v-img>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          title="Jak vytvořit nové cvičení za pomocí webového rozhraní"
        ></v-list-item>
      </template>
      <v-textarea
        variant="outlined"
        model-value="
      
      "
        auto-grow
        readonly
      >
      </v-textarea>
    </v-list-group>
  </v-list>
</template>
<script lang="ts">
export default {
  name: 'GuideQuestion',
};
</script>
