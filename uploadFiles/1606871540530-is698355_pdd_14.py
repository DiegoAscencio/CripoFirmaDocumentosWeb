from collections.abc import Iterable, Iterator
from enum import Enum

# -----------------------------------------------------------------------------
# 2.- Iterador concreto
# -----------------------------------------------------------------------------
class Iterador(Iterator):

    class Tipo(Enum):
        KEY_1 = 0,
        KEY_1_REV = 1
        KEY_2 = 2
        KEY_2_REV = 3
        KEY_3 = 4

    INDICE = 0

    def __init__(self, coleccion: dict, tipo: Tipo = Tipo.KEY_1):
        # el metodo "Sorted" entrega una tupla
        if tipo == self.Tipo.KEY_1:
            self._coleccion = sorted(coleccion.items())
        elif tipo == self.Tipo.KEY_1_REV:
            self._coleccion = sorted(coleccion.items(), reverse=True)
        elif tipo == self.Tipo.KEY_2:
            self._coleccion = sorted(coleccion.items(), key=lambda kv:(kv[1], kv[0]))
        elif tipo == self.Tipo.KEY_2_REV:
            self._coleccion = sorted(coleccion.items(), key=lambda kv:(kv[1], kv[0]), reverse=True)
        else:
            raise NotImplementedError('La forma de recorrer el diccionarion no esta aun implementado')

    def __next__(self):
        try:
            elemento = self._coleccion[self.INDICE]
            self.INDICE += 1
        except IndexError:
            raise StopIteration() # Importante para detener el ciclo
        return elemento

# -----------------------------------------------------------------------------
# 4.- Colecciones Concretas
# -----------------------------------------------------------------------------
class Videojuegos(Iterable):

    def __init__(self, coleccion: dict = {}):
        self._coleccion = coleccion

    def __iter__(self):
        return Iterador(self._coleccion)

    def steamcalificacion_mas_baja_primero(self):
        return Iterador(self._coleccion, Iterador.Tipo.KEY_2)

    def steamcalificacion_mas_alta_primero(self):
        return Iterador(self._coleccion, Iterador.Tipo.KEY_2_REV)

    def registrar(self, alumno, calificacion):
        self._coleccion[alumno] = calificacion


if __name__ == "__main__":

    steam = Videojuegos()
    steam.registrar('GTA V', 9.3)
    steam.registrar('The Legend of Zelda: Breath of the Wild', 9.5)
    steam.registrar('BioShock', 7.1)
    steam.registrar('Half-Life 2', 8.7)
    steam.registrar('Super Mario Galaxy 2', 9)
    steam.registrar('Fallout 4', 8.8)

    print('-I- Mostrando las Videojuegos en order alfabetico de los titulos')
    for registro in steam:
        print(registro)
    print()

    print('-I- Mostrando las Videojuegos primero las calificaciones mas altas')
    for registro in steam.steamcalificacion_mas_alta_primero():
        print(registro)
    print()

    print('-I- Mostrando las Videojuegos primero las calificaciones mas bajas')
    for registro in steam.steamcalificacion_mas_baja_primero():
        print(registro)
    print()
    
